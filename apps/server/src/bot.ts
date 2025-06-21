import { Bot, Context, session, SessionFlavor } from "grammy";
import { Conversation, ConversationFlavor, conversations, createConversation } from "@grammyjs/conversations";

import { db } from "./db";
import { eq } from "drizzle-orm";
import { orders } from "./db/schema";

interface SessionData {
    orderId: string;
}

type MyContext = ConversationFlavor<Context> & SessionFlavor<SessionData>;
type MyConversationContext = Context;

const OWNER_CHAT = process.env.OWNER_CHAT_ID;

export const bot = new Bot<MyContext>(process.env.BOT_TOKEN);

type MyConversation = Conversation<MyContext, MyConversationContext>;

function initial(): SessionData {
    return { orderId: "" };
}

bot.use(session({ initial }));

bot.use(conversations());
bot.use(createConversation(designerFlow));
bot.use(createConversation(printerFlow));

function isNumeral(price: number) {
    return isFinite(price) && price > 0;
}

async function designerFlow(conversation: MyConversation, ctx: MyConversationContext) {
    const session = await conversation.external((ctx) => ctx.session);
    const orderId = session.orderId;

    await ctx.reply("Введите вашу цену:");

    const { message } = await conversation.waitFor("message:text");
    let price = Number(message.text);

    if (!isNumeral(price)) {
        while (!isNumeral(price)) {
            await ctx.reply("Неправильный ввод, введите вашу цену:");

            const { message } = await conversation.waitFor("message:text");
            price = Number(message.text);
        }
    }

    await db.update(orders).set({ designer_price: price }).where(eq(orders.uuid, orderId));

    await ctx.reply(`Цена ${price} сохранена.`);

    await ctx.api.sendMessage(OWNER_CHAT, `Дизайнер поставил цену $${price} для заказа #${orderId}.`);
}

async function printerFlow(conversation: MyConversation, ctx: MyConversationContext) {
    const session = await conversation.external((ctx) => ctx.session);
    const orderId = session.orderId;

    await ctx.reply("Введите вашу цену:");

    const { message } = await conversation.waitFor("message:text");
    let price = Number(message.text);

    if (!isNumeral(price)) {
        while (!isNumeral(price)) {
            await ctx.reply("Неправильный ввод, введите вашу цену:");

            const { message } = await conversation.waitFor("message:text");
            price = Number(message.text);
        }
    }

    await db.update(orders).set({ printer_price: price }).where(eq(orders.uuid, orderId));

    await ctx.reply(`Цена ${price} сохранена.`);

    await ctx.api.sendMessage(OWNER_CHAT, `Принтер поставил $${price} для заказа #${orderId}.`);
}

bot.start();

bot.callbackQuery(/^designerFlow:(.+)$/, async (ctx) => {
    const orderId = ctx.callbackQuery.data.split(":")[1];

    ctx.session.orderId = orderId;

    await ctx.conversation.enter("designerFlow");

    await ctx.api.answerCallbackQuery(ctx.callbackQuery.id);
    await ctx.editMessageReplyMarkup();
});

bot.callbackQuery(/^printerFlow:(.+)$/, async (ctx) => {
    const orderId = ctx.callbackQuery.data.split(":")[1];

    ctx.session.orderId = orderId;

    await ctx.conversation.enter("printerFlow");

    await ctx.api.answerCallbackQuery(ctx.callbackQuery.id);
    await ctx.editMessageReplyMarkup();
});
