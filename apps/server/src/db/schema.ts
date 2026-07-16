import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// * Values match product ids in the frontend catalogue (apps/frontend/src/data/site.ts)
export const productIds = [
    "design",
    "stickers",
    "pins",
    "posters",
    "tshirts",
    "mugs",
    "keychains",
    "badges",
    "merch",
] as const;

export const statusValues = [
    "new",
    "awaiting_design",
    "awaiting_production",
    "awaiting_markup",
    "invoiced",
    "paid",
    "manual",
] as const;

export const orders = sqliteTable("orders", {
    id: integer().primaryKey({ autoIncrement: true }),

    firstName: text().notNull(),
    lastName: text().notNull(),
    email: text().notNull(),
    tel: text("telephone"),

    product: text({ enum: productIds }).notNull(),
    needsDesign: integer({ mode: "boolean" }).notNull().default(false),
    description: text().notNull(),

    status: text({ enum: statusValues }).notNull().default("new"),

    designPrice: real(),
    productionPrice: real(),
    markup: real(),
    finalPrice: real(),

    paypalInvoiceId: text(),
    // * Telegram file ids of the reference photos, reused when forwarding to the next specialist
    photoFileIds: text({ mode: "json" }).$type<string[]>(),

    createdAt: integer({ mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date()),
});
