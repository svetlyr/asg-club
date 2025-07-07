import type { TupleExclude } from "@utils/types";
import {
    picklist,
    message,
    pipe,
    minLength,
    minValue,
    maxValue,
    object,
    number,
    optional,
    string,
    url,
    pick,
    type SchemaWithPick,
    type InferInput,
} from "valibot";

import { concatTuples } from "@utils";
import { getTypedSchemaKeys } from "@utils/schema";

export const serviceTypes = [
    "Graphic Design",
    "Stickers/Decals",
    "Jacket Pins",
    "Wall Posters/Banners",
    "T-Shirts",
    "Mugs",
    "Metal Badges and Medals",
    "Keychains",
    "Custom Merch",
] as const;
export type ServiceType = (typeof serviceTypes)[number];

export const unitTypes = {
    size: ["EU", "US"],
    dimensions: ["cm", "inch"],
} as const;
export const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const _measurementKeys = ["dimensions", "size"] as const;
export type MeasurementKey = (typeof _measurementKeys)[number];

// prettier-ignore
const additionalFields = {
    "Graphic Design":           [],
    "Stickers/Decals":          ["quantity", "width", "height"],
    "Jacket Pins":              ["quantity", "width", "height"],
    "Wall Posters/Banners":     ["quantity", "width", "height"],
    "T-Shirts":                 ["size"],
    "Mugs":                     ["quantity"],
    "Keychains":                ["quantity"],
    "Metal Badges and Medals":  ["quantity"],
    "Custom Merch":             ["quantity"],
} as const;
export type AdditionalFieldKey = (typeof additionalFields)[ServiceType][number];

export const baseServiceSchema = object({
    serviceType: picklist(serviceTypes),
    description: message(pipe(string(), minLength(10)), "Description must be at least 10 characters long"),
    url: optional(pipe(string(), url())),
});

const schemaUnitTypes = [...unitTypes.size, ...unitTypes.dimensions] as const;
export const optionalServiceSchema = object({
    quantity: optional(message(pipe(number(), minValue(1), maxValue(999)), "Quantity must be between 1 and 999")),
    width: optional(message(pipe(number(), minValue(1), maxValue(50)), "Width must be between 1 and 50")),
    height: optional(message(pipe(number(), minValue(1), maxValue(50)), "Height must be between 1 and 50")),
    unitType: optional(picklist(schemaUnitTypes)),
    size: optional(picklist(sizes)),
});

export const serviceDetailsSchema = object({
    ...baseServiceSchema.entries,
    ...optionalServiceSchema.entries,
});

const baseServiceFields = getTypedSchemaKeys(baseServiceSchema);

const rawServiceDetailsSchema = pick(serviceDetailsSchema, getTypedSchemaKeys(serviceDetailsSchema));
export type RawServiceDetailsSchema = InferInput<typeof rawServiceDetailsSchema>;

type ServiceFieldKeys = [...typeof baseServiceFields, ...(typeof additionalFields)[ServiceType]];
export type ServiceDetailsSchema = SchemaWithPick<typeof rawServiceDetailsSchema, ServiceFieldKeys>;

export function getServiceDetailsSchema(serviceType: ServiceType): ServiceDetailsSchema {
    const keys = concatTuples(baseServiceFields, additionalFields[serviceType]);

    return pick(rawServiceDetailsSchema, keys);
}

// * Type helper that replaces "width" and "height" with "dimensions"
type UiSchemaFields<S extends ServiceType> = (typeof additionalFields)[S] extends infer Fields extends readonly string[]
    ? "width" extends Fields[number]
        ? "height" extends Fields[number]
            ? readonly ["dimensions", ...TupleExclude<Fields, "width" | "height">]
            : Fields
        : Fields
    : never;

type UiSchemaFieldsMap = {
    [S in ServiceType]: UiSchemaFields<S>;
};
export type UiSchemaFieldKey = UiSchemaFields<ServiceType>[number];

// * additionalFields object but "width" and "height" replaced with "dimensions"
export const uiSchemaFields = Object.entries(additionalFields).reduce<Record<string, readonly string[]>>(
    (acc, [service, fields]) => {
        const filtered = fields.filter((f) => !["width", "height"].includes(f));

        if (filtered.length !== fields.length) {
            acc[service] = ["dimensions", ...filtered];
        } else {
            acc[service] = fields;
        }

        return acc;
    },
    {},
) as UiSchemaFieldsMap;
