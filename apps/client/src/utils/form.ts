import { toCustom, type TransformField } from "@modular-forms/solid";
import type { OrderSchema } from "@schemas/formSchema";

export const handleNumberTransform: TransformField<number | undefined> = toCustom(
    // * We pass empty string (in jsx) when value is 0 to show placeholder
    // @ts-expect-error ----------
    (value) => (value === "" ? 0 : Number(value)),
    {
        on: "input",
    },
);

export const buildFormData = ({ files, ...order }: OrderSchema): FormData => {
    const formData = new FormData();

    if (files) {
        files.forEach((file) => formData.append("images", file, file.name));
    }

    formData.append("order", new Blob([JSON.stringify(order)], { type: "application/json" }), "order.json");

    return formData;
};
