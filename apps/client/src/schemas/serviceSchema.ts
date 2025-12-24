import {
    url,
    file,
    pick,
    pipe,
    array,
    number,
    object,
    string,
    maxSize,
    message,
    maxValue,
    mimeType,
    minValue,
    optional,
    picklist,
    maxLength,
    minLength,
    type SchemaWithPick,
} from "valibot";

import { getTypedSchemaKeys } from "@utils/schema";
import { type AdditionalFields } from "@constants";
import { sizes, serviceTypes, type ServiceType, fileTypes, schemaUnitTypes } from "@constants";

export const filesSchema = optional(
    pipe(
        array(
            pipe(
                file("Please select an image file."),
                mimeType(fileTypes, "Please select a JPEG, PNG or WEBP file."),
                maxSize(1024 * 1024 * 10, "Please select a file smaller than 10 MB."),
            ),
        ),
        maxLength(5),
    ),
);

export const baseServiceSchema = object({
    serviceType: picklist(serviceTypes),
    files: filesSchema,
    description: message(pipe(string(), minLength(10)), "Description must be at least 10 characters long"),
    url: optional(pipe(string(), url())),
});

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

export const baseServiceFields = getTypedSchemaKeys(baseServiceSchema);
export const rawServiceDetailsSchema = pick(serviceDetailsSchema, getTypedSchemaKeys(serviceDetailsSchema));

// * Specific schema per service type
type ServiceFieldKeys = [...typeof baseServiceFields, ...AdditionalFields[ServiceType]];
export type ServiceDetailsSchema = SchemaWithPick<typeof rawServiceDetailsSchema, ServiceFieldKeys>;
