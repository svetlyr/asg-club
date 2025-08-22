import { InlineKeyboard, InputFile, InputMediaBuilder } from "grammy";
import { env } from "@yolk-oss/elysia-env";
import { cors } from "@elysiajs/cors";
import { Elysia, t } from "elysia";

import { db } from "./db";
import { bot, transporter } from "./bot";
import { orders } from "./db/schema";
// import { OAuth2Client } from "google-auth-library";
// import { GoogleSpreadsheet } from "google-spreadsheet";
import { eq, sql } from "drizzle-orm";

const orderDto = t.Object({
    images: t.Optional(t.Files({ format: ["image/jpg", "image/jpeg", "image/png", "image/webp"] })),
    order: t.File({ format: "application/json" }),
});

type orderSchema = {
    url?: string;
    email: string;
    fullname: string;
    tel: string;
    serviceType:
        | "Graphic Design"
        | "Stickers/Decals"
        | "Jacket Pins"
        | "Wall Posters/Banners"
        | "T-Shirts"
        | "Mugs"
        | "Keychains"
        | "Metal Badges and Medals"
        | "Custom Merch";
    description: string;
    quantity: number;
    width: number;
    height: number;
    unitType: "cm" | "inch";
    comments: string;
};

const envSchema = {
    BOT_TOKEN: t.String(),
    DATABASE_URL: t.String(),

    OWNER_CHAT_ID: t.Number(),
    DESIGNER_CHAT_ID: t.Number(),
    PRINTER_CHAT_ID: t.Number(),
    FACTORY_CHAT_ID: t.Number(),

    GOOGLE_CLIENT_ID: t.String(),
    GOOGLE_CLIENT_SECRET: t.String(),
    GOOGLE_REFRESH_TOKEN: t.String(),
};

// TODO: uncomment after client will acquire personal server
// export const flowControl = new Map<number, { counter: number; response: string[] }>();

async function sendImages(chatId: number, images: File[]): Promise<void> {
    const mediaGroup = await Promise.all(
        images.map(async (img) => InputMediaBuilder.photo(new InputFile(await img.bytes()))),
    );

    await bot.api.sendMediaGroup(chatId, mediaGroup);

    // const fileIds = sentMessages.map((msg) => msg.photo[msg.photo.length - 1].file_id as string);

    // const mediaGroupWithFileIds = fileIds.map((fileId) => InputMediaBuilder.photo(fileId));

    // await bot.api.sendMediaGroup(PRINTER_CHAT, mediaGroupWithFileIds);
}

async function sendMessage(
    order: orderSchema,
    orderId: number,
    chatId: number,
    flow: "designer" | "printer" | "factory",
): Promise<void> {
    let text = `New order with ID: ${orderId}`;

    for (const [key, value] of Object.entries(order)) {
        if (value) text += `\n${key}: ${value}`;
    }

    await db
        .update(orders)
        .set({ counter: sql`${orders.counter} + 1` })
        .where(eq(orders.id, orderId));

    await bot.api.sendMessage(chatId, text, {
        reply_markup: new InlineKeyboard().text("Поставить цену", `${flow}Flow:${orderId}`),
    });
}

// const oauthClient = new OAuth2Client({
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     credentials: {
//         refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
//     },
// });

new Elysia()
    .use(
        env(envSchema, {
            onError: (env) => {
                console.log("Missing environment variables:", env);
            },
            onSuccess: (env) => {
                console.log("Successfully loaded environment variables:", env);
            },
        }),
    )
    .use(cors())
    .post(
        "/orders",
        async ({ body: { images, order }, env }) => {
            console.log("Received order:", order);

            // * Custom validation
            const parsedOrder = (await order.json()) as orderSchema;

            if (parsedOrder.serviceType === "Custom Merch") {
                let text = `New order for custom merch.`;

                for (const [key, value] of Object.entries(parsedOrder)) {
                    if (value) text += `\n${key}: ${value}`;
                }

                const mail = {
                    from: '"ASG Designs" <asgdesigns.store@gmail.com>',
                    to: "asgdesigns.store@gmail.com",
                    subject: "Custome Merch Order",
                    text,
                    attachments: images
                        ? await Promise.all(
                              images.map(async (image) => {
                                  return {
                                      filename: `${Date.now()}.jpg`,
                                      content: Buffer.from(await image.arrayBuffer()),
                                      encoding: "base64",
                                  };
                              }),
                          )
                        : undefined,
                };

                await transporter.sendMail(mail);
                return;
            }

            // try {
            //     await db.insert(orders).values(parsedOrder).returning({ orderId: orders.id });
            // } catch (error) {
            //     console.log(error);
            // }
            const result = await db.insert(orders).values(parsedOrder).returning({ orderId: orders.id });

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const orderId = result[0]!.orderId;

            const DESIGNER_CHAT = env.DESIGNER_CHAT_ID;
            const PRINTER_CHAT = env.PRINTER_CHAT_ID;
            const FACTORY_CHAT = env.FACTORY_CHAT_ID;

            if (images) {
                await sendImages(DESIGNER_CHAT, images);
            }

            await sendMessage(parsedOrder, orderId, DESIGNER_CHAT, "designer");

            if (parsedOrder.serviceType === "Graphic Design") {
                return;
            }

            if (parsedOrder.serviceType === "Stickers/Decals" || parsedOrder.serviceType === "Wall Posters/Banners") {
                await sendMessage(parsedOrder, orderId, PRINTER_CHAT, "printer");
            } else {
                await sendMessage(parsedOrder, orderId, FACTORY_CHAT, "factory");
            }
        },
        {
            body: orderDto,
        },
    )
    .listen(3000, () => {
        console.log("Elysia server running on http://localhost:3000");
    });
