import { pgTable, varchar, pgEnum, smallint, serial, real } from "drizzle-orm/pg-core";

export const servicesEnum = pgEnum("services", [
    "Graphic Design",
    "Stickers/Decals",
    "Jacket Pins",
    "Wall Posters/Banners",
    "T-Shirts",
    "Mugs",
    "Keychains",
    "Metal Badges and Medals",
    "Custom Merch",
]);

export const unitEnum = pgEnum("units", ["cm", "inch"]);

export const sizesEnum = pgEnum("sizes", ["XS", "S", "M", "L", "XL", "XXL"]);

export const orders = pgTable("orders", {
    id: serial().primaryKey(),
    email: varchar().notNull(),
    fullname: varchar().notNull(),
    tel: varchar("telephone"),
    serviceType: servicesEnum().notNull(),
    description: varchar().notNull(),
    url: varchar(),
    quantity: smallint(),
    width: real(),
    height: real(),
    size: sizesEnum(),
    unitType: unitEnum(),
    comments: varchar(),

    designerPrice: real().default(0),
    printerPrice: real().default(0),
    factoryPrice: real().default(0),
    finalPrice: real(),

    counter: smallint().default(0),
    text: varchar().default(""),
});
