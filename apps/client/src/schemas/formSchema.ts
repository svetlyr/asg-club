import { object, string, union, literal, regex, email, pipe, message, optional, type InferInput } from "valibot";
import { serviceDetailsSchema } from "@schemas/serviceSchema";

// https://ihateregex.io/expr/phone
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export const basicDetailsSchema = object({
    email: message(pipe(string(), email()), "Invalid email address"),
    fullname: optional(pipe(string())),
    tel: optional(message(union([pipe(string(), regex(phoneRegex)), literal("")]), "Invalid phone number")),
});

export const orderSchema = object({
    ...basicDetailsSchema.entries,
    ...serviceDetailsSchema.entries,
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
    files: undefined,
    quantity: 0,
    width: 0,
    height: 0,
    unitType: "cm",
    size: "M",

    comments: "",
};

export type BasicDetailsSchema = InferInput<typeof basicDetailsSchema>;
