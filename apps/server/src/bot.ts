import { eq, sql } from "drizzle-orm";
import { Bot, GrammyError, HttpError, InlineKeyboard, InputFile, InputMediaBuilder } from "grammy";
import { type OrderRow, products, type Stage, stageFor } from "./config";
import { db } from "./db";
import { orders } from "./db/schema";
import { createAndSendInvoice } from "./paypal";

export const bot = new Bot(process.env.BOT_TOKEN);

const CHATS = {
    owner: process.env.OWNER_CHAT_ID,
    designer: process.env.DESIGNER_CHAT_ID,
    printer: process.env.PRINTER_CHAT_ID,
    factory: process.env.FACTORY_CHAT_ID,
} as const;

// --- helpers ---

async function getOrder(orderId: number): Promise<OrderRow | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order;
}

function chatForStage(order: OrderRow, stage: Stage): string {
    if (stage === "markup") return CHATS.owner;
    if (stage === "design") return CHATS.designer;

    const config = products[order.product];
    // * Production stage only exists for production products
    return config.kind === "production" ? CHATS[config.production] : CHATS.owner;
}

function orderDetails(order: OrderRow): string {
    return [
        `Продукт: ${products[order.product].label}`,
        `Клиент: ${order.firstName} ${order.lastName}`,
        `Email: ${order.email}`,
        order.tel ? `Телефон: ${order.tel}` : null,
        "",
        order.description,
    ]
        .filter((line) => line !== null)
        .join("\n");
}

function specialistText(order: OrderRow, stage: Stage): string {
    const task = stage === "design" ? "нужен дизайн" : "нужно производство";
    return `Новый заказ #${order.id} — ${task}\n\n${orderDetails(order)}`;
}

function ownerSummaryText(order: OrderRow): string {
    return [
        `Заказ #${order.id} — все цены готовы`,
        order.designPrice !== null ? `Дизайн: ${order.designPrice}` : null,
        order.productionPrice !== null ? `Производство: ${order.productionPrice}` : null,
        "",
        orderDetails(order),
    ]
        .filter((line) => line !== null)
        .join("\n");
}

/** Uploads raw photos as documents (full quality) or re-sends previously uploaded ones by file id. */
async function sendOrderPhotos(chatId: string, order: OrderRow, rawImages?: File[]): Promise<void> {
    if (rawImages?.length) {
        let fileIds: string[];

        if (rawImages.length === 1) {
            const image = rawImages[0]!;
            const message = await bot.api.sendDocument(chatId, new InputFile(await image.bytes(), image.name));
            fileIds = [message.document.file_id];
        } else {
            const mediaGroup = await Promise.all(
                rawImages.map(async (image) =>
                    InputMediaBuilder.document(new InputFile(await image.bytes(), image.name)),
                ),
            );
            const messages = await bot.api.sendMediaGroup(chatId, mediaGroup);
            fileIds = messages
                .map((message) => ("document" in message ? message.document.file_id : undefined))
                .filter((id): id is string => Boolean(id));
        }

        await db.update(orders).set({ photoFileIds: fileIds }).where(eq(orders.id, order.id));
        return;
    }

    const fileIds = order.photoFileIds ?? [];
    if (fileIds.length === 0) return;

    if (fileIds.length === 1) {
        await bot.api.sendDocument(chatId, fileIds[0]!);
    } else {
        await bot.api.sendMediaGroup(
            chatId,
            fileIds.map((id) => InputMediaBuilder.document(id)),
        );
    }
}

// --- pipeline ---

const STATUS_BY_STAGE = {
    design: "awaiting_design",
    production: "awaiting_production",
    markup: "awaiting_markup",
} as const;

/** Moves the order to its current unpriced stage and asks the responsible party for a price. */
export async function advanceOrder(orderId: number, rawImages?: File[]): Promise<void> {
    const order = await getOrder(orderId);
    if (!order) return;

    const stage = stageFor(order);
    if (!stage) return;

    await db.update(orders).set({ status: STATUS_BY_STAGE[stage] }).where(eq(orders.id, orderId));

    const chatId = chatForStage(order, stage);

    if (stage === "markup") {
        await bot.api.sendMessage(chatId, ownerSummaryText(order), {
            reply_markup: new InlineKeyboard().text("Установить наценку", `price:${orderId}`),
        });
        return;
    }

    await sendOrderPhotos(chatId, order, rawImages);
    await bot.api.sendMessage(chatId, specialistText(order, stage), {
        reply_markup: new InlineKeyboard().text("Поставить цену", `price:${orderId}`),
    });
}

/** Notifies everyone involved that the order is paid and work can start. */
export async function notifyPaid(order: OrderRow): Promise<void> {
    const config = products[order.product];
    const chats = new Set<string>([CHATS.owner]);

    if (config.kind === "design" || order.needsDesign) chats.add(CHATS.designer);
    if (config.kind === "production") chats.add(CHATS[config.production]);

    await Promise.all(
        [...chats].map((chatId) =>
            bot.api.sendMessage(chatId, `💰 Заказ #${order.id} оплачен. Можно начинать работу.`),
        ),
    );
}

type InvoiceResult = { ok: true; finalPrice: number | null; email: string } | { ok: false; error: string };

async function invoiceOrder(order: OrderRow): Promise<InvoiceResult> {
    try {
        const invoiceId = await createAndSendInvoice(order);
        await db.update(orders).set({ paypalInvoiceId: invoiceId, status: "invoiced" }).where(eq(orders.id, order.id));

        return { ok: true, finalPrice: order.finalPrice, email: order.email };
    } catch (error) {
        console.error(`Invoice failed for order #${order.id}:`, error);
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
}

/** Saves the owner's markup, computes the final price and sends the PayPal invoice. */
async function finalizeOrder(orderId: number, markup: number): Promise<InvoiceResult> {
    const [order] = await db
        .update(orders)
        .set({
            markup,
            finalPrice: sql`coalesce(${orders.designPrice}, 0) + coalesce(${orders.productionPrice}, 0) + ${markup}`,
        })
        .where(eq(orders.id, orderId))
        .returning();

    if (!order) return { ok: false, error: "заказ не найден" };
    return invoiceOrder(order);
}

/** Retry path for when invoice creation failed after the markup was already saved. */
async function retryInvoice(orderId: number): Promise<InvoiceResult> {
    const order = await getOrder(orderId);

    if (!order) return { ok: false, error: "заказ не найден" };
    if (order.paypalInvoiceId) return { ok: false, error: "инвойс уже создан" };
    if (order.finalPrice === null) return { ok: false, error: "финальная цена ещё не установлена" };

    return invoiceOrder(order);
}

// --- price collection (stateless, via force_reply) ---

function isValidPrice(price: number): boolean {
    return Number.isFinite(price) && price > 0;
}

// * The "#<id>" marker in the prompt is what links the reply back to the order
function askPrice(chatId: string | number, orderId: number, stage: Stage, prefix = ""): Promise<unknown> {
    const what = stage === "markup" ? "наценку" : "цену";

    return bot.api.sendMessage(chatId, `${prefix}Введите ${what} для заказа #${orderId}:`, {
        reply_markup: { force_reply: true },
    });
}

bot.callbackQuery(/^price:(\d+)$/, async (ctx) => {
    const orderId = Number(ctx.callbackQuery.data.split(":")[1]);
    const order = await getOrder(orderId);
    const stage = order && stageFor(order);

    if (!order || !stage) {
        await ctx.answerCallbackQuery(`Заказ #${orderId} уже обработан.`);
        return;
    }

    await askPrice(ctx.chat?.id ?? chatForStage(order, stage), orderId, stage);
    await ctx.answerCallbackQuery();
    await ctx.editMessageReplyMarkup({ reply_markup: undefined });
});

bot.callbackQuery(/^invoice:(\d+)$/, async (ctx) => {
    const orderId = Number(ctx.callbackQuery.data.split(":")[1]);

    await ctx.answerCallbackQuery();
    const result = await retryInvoice(orderId);

    await ctx.reply(
        result.ok
            ? `✅ Инвойс для заказа #${orderId} отправлен на ${result.email}.`
            : `⚠️ Инвойс не создан: ${result.error}`,
        result.ok ? undefined : { reply_markup: new InlineKeyboard().text("Повторить инвойс", `invoice:${orderId}`) },
    );
});

bot.on("message:text", async (ctx) => {
    // * Only react to replies to our own price prompts
    const prompt = ctx.message.reply_to_message;
    if (!prompt || prompt.from?.id !== ctx.me.id) return;

    const match = /для заказа #(\d+)/.exec(prompt.text ?? "");
    if (!match) return;

    const orderId = Number(match[1]);
    const order = await getOrder(orderId);
    const stage = order && stageFor(order);

    if (!order || !stage) {
        await ctx.reply(`Заказ #${orderId} уже обработан.`);
        return;
    }

    if (String(ctx.chat.id) !== chatForStage(order, stage)) {
        await ctx.reply(`Сейчас очередь другого этапа для заказа #${orderId}.`);
        return;
    }

    const price = Number(ctx.message.text.replace(",", "."));

    if (!isValidPrice(price)) {
        await askPrice(ctx.chat.id, orderId, stage, "Неправильный ввод. ");
        return;
    }

    if (stage === "markup") {
        const result = await finalizeOrder(orderId, price);

        if (result.ok) {
            await ctx.reply(
                `✅ Финальная цена ${result.finalPrice} для заказа #${orderId}. Инвойс отправлен на ${result.email}.`,
            );
        } else {
            await ctx.reply(`⚠️ Наценка сохранена, но инвойс не создан: ${result.error}`, {
                reply_markup: new InlineKeyboard().text("Повторить инвойс", `invoice:${orderId}`),
            });
        }
        return;
    }

    const patch = stage === "design" ? { designPrice: price } : { productionPrice: price };
    await db.update(orders).set(patch).where(eq(orders.id, orderId));

    await ctx.reply(`Цена ${price} для заказа #${orderId} сохранена.`);
    await advanceOrder(orderId);
});

bot.catch(({ error, ctx }) => {
    console.error(`Bot error while handling update ${ctx.update.update_id}:`);

    if (error instanceof GrammyError) console.error("Telegram API error:", error.description);
    else if (error instanceof HttpError) console.error("Could not contact Telegram:", error);
    else console.error(error);
});

// * Keep the HTTP server alive even if Telegram is unreachable at boot —
// * orders still get saved and emailed, the pipeline resumes once the bot reconnects
bot.start().catch((error: unknown) => {
    console.error("Telegram bot failed to start:", error);
});
