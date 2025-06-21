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
    optional,
    type SchemaWithPick,
    minLength,
} from "valibot";
import {
    additionalServiceFields,
    allServiceFields,
    baseServiceFields,
    serviceTypes,
    unitTypes,
    type ServiceFieldKeys,
    type ServiceType,
} from "@lib/serviceTypes";
import { concatTuples } from "@utils";

// https://ihateregex.io/expr/phone
const phoneRegex = new RegExp(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/);

export const orderSchema = object({
    email: pipe(string(), email()),
    fullname: pipe(string(), nonEmpty()),
    tel: union([pipe(string(), regex(phoneRegex)), literal("")]),
    serviceType: picklist(serviceTypes),
    description: pipe(string(), nonEmpty()),
    quantity: optional(pipe(number(), minValue(1), maxValue(999))),
    dimensions: optional(pipe(number(), minValue(1), maxValue(50))),
    unitType: optional(picklist(unitTypes)),
    size: optional(picklist(unitTypes)), // TODO: size opts
    comments: pipe(string(), minLength(10)),
});

export type OrderSchema = InferInput<typeof orderSchema>;
export type OrderKeys = keyof OrderSchema;

export const orderDefaults: OrderSchema = {
    email: "",
    fullname: "",
    tel: "",
    serviceType: "Graphic Design",
    description: "",
    quantity: 0,
    dimensions: 0,
    unitType: "cm",
    size: "cm",
    comments: "",
};

export const basicDetailsSchema = pick(orderSchema, ["email", "fullname", "tel"]);
export type BasicDetailsSchema = InferInput<typeof basicDetailsSchema>;

const rawServiceDetailsSchema = pick(orderSchema, allServiceFields);
export type AllServiceDetailsSchema = InferInput<typeof rawServiceDetailsSchema>;

export type ServiceDetailsSchema = SchemaWithPick<typeof rawServiceDetailsSchema, ServiceFieldKeys>;
export function getServiceDetailsSchema(serviceType: ServiceType): ServiceDetailsSchema {
    const keys = concatTuples(baseServiceFields, additionalServiceFields[serviceType]);

    return pick(rawServiceDetailsSchema, keys);
}
