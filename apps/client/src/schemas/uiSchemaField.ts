import { type TupleExclude } from "@utils/types";
import { type ServiceType, additionalFields } from "@constants";

// * Type helper that replaces "width" and "height" with "dimensions"
export type UiSchemaFields<S extends ServiceType> = (typeof additionalFields)[S] extends infer Fields extends
    readonly string[]
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
