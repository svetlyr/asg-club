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
    message,
    picklist,
    optional,
    minLength,
    type InferInput,
    type SchemaWithPick,
    url,
    custom,
} from "valibot";
import {
    additionalServiceFields,
    allServiceFields,
    baseServiceFields,
    serviceTypes,
    type ServiceFieldKeys,
    type ServiceType,
} from "@lib/serviceTypes";
import { concatTuples } from "@utils";

export const unitTypes = ["cm", "inch"] as const;
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

// https://ihateregex.io/expr/phone
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
// https://ihateregex.io/expr/url
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/;

export const orderSchema = object({
    email: message(pipe(string(), email()), "Invalid email address"),
    fullname: optional(pipe(string())),
    tel: optional(message(union([pipe(string(), regex(phoneRegex)), literal("")]), "Invalid phone number")),

    serviceType: picklist(serviceTypes),
    description: message(pipe(string(), minLength(10)), "Description must be at least 10 characters long"),
    // url: optional(pipe(string(), regex(urlRegex, "Invalid URL"))),
    // TODO: fix url validation
    url: optional(
        pipe(
            string(),
            custom((value) => {
                const a = urlRegex.test(value as string);

                console.log(a, value);

                return a;
            }),
        ),
    ),

    quantity: optional(message(pipe(number(), minValue(1), maxValue(999)), "Quantity must be between 1 and 999")),
    dimensions: object({
        width: optional(message(pipe(number(), minValue(1), maxValue(50)), "Width must be between 1 and 50")),
        height: optional(message(pipe(number(), minValue(1), maxValue(50)), "Height must be between 1 and 50")),
    }),
    unitType: optional(picklist(unitTypes)),
    size: optional(picklist(sizes)),

    comments: optional(string()),
});

export type OrderSchema = InferInput<typeof orderSchema>;
export type OrderKeys = keyof OrderSchema;

export const orderDefaults: OrderSchema = {
    email: "",
    fullname: "",
    tel: "",

    serviceType: "Graphic Design",
    url: "",
    description: "",
    quantity: undefined,
    dimensions: { width: undefined, height: undefined },
    unitType: "cm",
    size: "M",

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
