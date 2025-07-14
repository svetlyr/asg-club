import { toCustom, type TransformField } from "@modular-forms/solid";

export const handleNumberTransform: TransformField<number | undefined> = toCustom(
    // * We pass empty string (in jsx) when value is 0 to show placeholder
    // @ts-expect-error ----------
    (value) => (value === "" ? 0 : Number(value)),
    {
        on: "input",
    },
);
