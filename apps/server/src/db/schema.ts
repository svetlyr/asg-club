import { pgTable, varchar, pgEnum, smallint, uuid, integer } from "drizzle-orm/pg-core";

export const servicesEnum = pgEnum("services", [
    "Graphic Design",
    "Stickers/Decals",
    "Jacket Pins",
    "Wall Posters/Banners",
    "T-Shirts",
    "Mugs",
    "Keychains",
    "Custom Merch",
    "Balls",
]);

export const unitEnum = pgEnum("units", ["cm", "inch"]);

export const orders = pgTable("orders", {
    uuid: uuid().defaultRandom().primaryKey(),
    email: varchar().notNull(),
    fullname: varchar().notNull(),
    tel: varchar("telephone").notNull(),
    serviceType: servicesEnum().notNull(),
    description: varchar().notNull(),
    quantity: smallint().notNull(),
    dimensions: smallint().notNull(),
    unitType: unitEnum().notNull(),
    comments: varchar().notNull(),

    designer_price: integer(),
    printer_price: integer(),
});
