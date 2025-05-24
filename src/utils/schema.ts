import {
    object,
    string,
    number,
    union,
    literal,
    regex,
    email,
    maxLength,
    minValue,
    maxValue,
    pipe,
    pick,
    picklist,
    nonEmpty,
    type InferInput,
} from "valibot";

const fullnameRegex = new RegExp(/^[A-Za-zА-Яа-я]{2,}(?:\s+[A-Za-zА-Яа-я]{2,})+$/);
const phoneRegex = new RegExp(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/);

const serviceType = ["Decals", "Jacket Pins", "Merch"] as const;

const unitType = ["cm", "inch"] as const;

export const orderSchema = object({
    email: pipe(string(), email()),
    fullname: pipe(string(), regex(fullnameRegex)),
    tel: union([pipe(string(), regex(phoneRegex)), literal("")]),
    serviceType: picklist(serviceType),
    description: pipe(string(), nonEmpty(), maxLength(60)),
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
