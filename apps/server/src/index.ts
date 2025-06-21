import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

import { InlineKeyboard } from "grammy";

import { db } from "./db";
import { bot } from "./bot";
import { orders } from "./db/schema";
import { createInsertSchema } from "drizzle-typebox";

const order = createInsertSchema(orders, {
    email: t.String({ format: "email" }),
});

const createOrder = t.Omit(order, ["uuid", "designer_price", "printer_price"]);

const DESIGNER_CHAT = process.env.DESIGNER_CHAT_ID;
const PRINTER_CHAT = process.env.PRINTER_CHAT_ID;

new Elysia()
    .use(cors())
    .post(
        "/orders",
        async ({ body }) => {
            const [{ orderUuid, fullname, description }] = await db
                .insert(orders)
                .values(body)
                .returning({ orderUuid: orders.uuid, fullname: orders.fullname, description: orders.description });

            bot.api.sendMessage(DESIGNER_CHAT, `Новый заказ #${orderUuid} для ${fullname}:\n` + `${description}`, {
                reply_markup: new InlineKeyboard().text("Поставить цену", `designerFlow:${orderUuid}`),
            });

            bot.api.sendMessage(PRINTER_CHAT, `Новый заказ #${orderUuid} для ${fullname}:\n` + `${description}`, {
                reply_markup: new InlineKeyboard().text("Поставить цену", `designerFlow:${orderUuid}`),
            });
        },
        {
            body: createOrder,
        },
    )
    .listen(3000, async () => {
        console.log("Elysia server running on http://localhost:3000");
    });
