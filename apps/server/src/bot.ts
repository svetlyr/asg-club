import {
    Bot,
    type CallbackQueryContext,
    type Context,
    GrammyError,
    HttpError,
    InlineKeyboard,
    session,
    type SessionFlavor,
} from "grammy";
import { type Conversation, type ConversationFlavor, conversations, createConversation } from "@grammyjs/conversations";

import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { orders } from "./db/schema";

import nodemailer from "nodemailer";
// import { flowControl } from "src";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "asgdesigns.store@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

type SessionData = {
    orderId: number;
};

type MyContext = ConversationFlavor<Context> & SessionFlavor<SessionData>;
type MyConversationContext = Context;

const OWNER_CHAT = process.env.OWNER_CHAT_ID;

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

type MyConversation = Conversation<MyContext>;

function initial(): SessionData {
    return { orderId: 0 };
}

function isValidPrice(price: number): boolean {
    return isFinite(price) && price > 0;
}

async function flowHandlerCallback(
    conversation: MyConversation,
    ctx: MyConversationContext,
    flow: "designer" | "printer" | "factory" | "owner",
): Promise<void> {
    const session = await conversation.external((ctx) => ctx.session);
    const orderId = session.orderId;

    await ctx.reply("Введите вашу цену:");

    const { message } = await conversation.waitFor("message:text");
    let price = Number(message.text);

    if (!isValidPrice(price)) {
        while (!isValidPrice(price)) {
            await ctx.reply("Неправильный ввод, введите вашу цену:");

            const { message } = await conversation.waitFor("message:text");
            price = Number(message.text);
        }
    }

    if (flow === "owner") {
        const [order] = await db
            .update(orders)
            .set({
                finalPrice: sql`${orders.designerPrice} + ${orders.printerPrice} + ${orders.factoryPrice} + ${price}`,
            })
            .where(eq(orders.id, orderId))
            .returning({ finalPrice: orders.finalPrice, email: orders.email });

        await ctx.reply(`✅ Финальная цена ${order?.finalPrice} для заказа #${orderId}, сохранена`);

        await transporter.sendMail({
            from: '"ASG Designs" <asgdesigns.store@gmail.com>',
            to: order?.email,
            subject: "Payment for order",
            text: "https://www.paypal.com/paypalme/AxelSniperGarage?country.x=MD&locale.x=en_US",
        });
    } else {
        type PriceKey = `${typeof flow}Price`;
        const obj: { [key in PriceKey]?: number } = {};
        obj[`${flow}Price`] = price;

        await db.update(orders).set(obj).where(eq(orders.id, orderId));

        await ctx.reply(`Цена ${price} для заказа с ID: ${orderId}, сохранена.`);

        const order = await db
            .update(orders)
            .set({
                counter: sql`${orders.counter} - 1`,
                text: sql`${orders.text} || '\n' || ${flow} || ': ' || ${price}`,
            })
            .where(eq(orders.id, orderId))
            .returning({ counter: orders.counter, text: orders.text });

        // const order = flowControl.get(orderId);
        // order.response.push(`${flow}: ${price}`);
        // flowControl.set(orderId, order);

        if (order[0]?.counter === 0) {
            await ctx.api.sendMessage(OWNER_CHAT, `✅ Цены установлены для заказа #${orderId}${order[0].text}`, {
                reply_markup: new InlineKeyboard().text("Установить финальную цену", `ownerFlow:${orderId}`),
            });

            //     flowControl.delete(orderId);
        }
    }
}

const designerFlow = async (conversation: MyConversation, ctx: MyConversationContext): Promise<void> =>
    flowHandlerCallback(conversation, ctx, "designer");

const printerFlow = async (conversation: MyConversation, ctx: MyConversationContext): Promise<void> =>
    flowHandlerCallback(conversation, ctx, "printer");

const factoryFlow = (conversation: MyConversation, ctx: MyConversationContext): Promise<void> =>
    flowHandlerCallback(conversation, ctx, "factory");

const ownerFlow = (conversation: MyConversation, ctx: MyConversationContext): Promise<void> =>
    flowHandlerCallback(conversation, ctx, "owner");

function createCallbackHandler(flowName: string) {
    return async (ctx: CallbackQueryContext<MyContext>) => {
        const orderId = Number(ctx.callbackQuery.data.split(":")[1]);

        // const order = flowControl.get(orderId);
        // if (!order) {
        //     await ctx.answerCallbackQuery("Заказ не найден!");
        //     return;
        // }

        // order.counter -= 1;
        // flowControl.set(orderId, order);

        ctx.session.orderId = orderId;

        await ctx.conversation.enter(flowName);
        await ctx.answerCallbackQuery();
        await ctx.editMessageReplyMarkup({ reply_markup: undefined });
    };
}

bot.use(session({ initial }));

bot.use(conversations());
bot.use(createConversation(designerFlow));
bot.use(createConversation(printerFlow));
bot.use(createConversation(factoryFlow));
bot.use(createConversation(ownerFlow));

bot.callbackQuery(/^designerFlow:(.+)$/, createCallbackHandler("designerFlow"));
bot.callbackQuery(/^printerFlow:(.+)$/, createCallbackHandler("printerFlow"));
bot.callbackQuery(/^factoryFlow:(.+)$/, createCallbackHandler("factoryFlow"));
bot.callbackQuery(/^ownerFlow:(.+)$/, createCallbackHandler("ownerFlow"));

void bot.start();
