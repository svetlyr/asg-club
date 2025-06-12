import {
    object,
    string,
    number,
    union,
    literal,
    regex,
    email,
    minValue,
    maxValue,
    pipe,
    pick,
    picklist,
    nonEmpty,
    type InferInput,
} from "valibot";

// https://ihateregex.io/expr/phone
const phoneRegex = new RegExp(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/);

export const serviceType = [
    "Graphic Design",
    "Stickers/Decals",
    "Jacket Pins",
    "Wall Posters/Banners",
    "T-Shirts",
    "Mugs",
    "Keychains",
    "Custom Merch",
    "Balls",
] as const;

export type ServiceType = (typeof serviceType)[number];

const unitType = ["cm", "inch"] as const;

export const orderSchema = object({
    email: pipe(string(), email()),
    fullname: string(),
    tel: union([pipe(string(), regex(phoneRegex)), literal("")]),
    serviceType: picklist(serviceType),
    description: pipe(string(), nonEmpty()),
    quantity: pipe(number(), minValue(1), maxValue(20)),
    dimensions: pipe(number(), minValue(1), maxValue(50)),
    unitType: picklist(unitType),
    comments: string(),
});

export type OrderSchema = InferInput<typeof orderSchema>;

export const basicDetailsSchema = pick(orderSchema, ["email", "fullname", "tel"]);
export type BasicDetailsSchema = InferInput<typeof basicDetailsSchema>;

export const serviceDetailsSchema = pick(orderSchema, [
    "serviceType",
    "description",
    "quantity",
    "dimensions",
    "unitType",
]);
export type ServiceDetailsSchema = InferInput<typeof serviceDetailsSchema>;
