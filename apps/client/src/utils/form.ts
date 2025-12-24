import type { OrderSchema } from "@schemas/formSchema";

export const buildFormData = ({ files, ...order }: OrderSchema): FormData => {
    const formData = new FormData();

    if (files) {
        files.forEach((file) => formData.append("images", file, file.name));
    }

    formData.append("order", new Blob([JSON.stringify(order)], { type: "application/json" }), "order.json");

    return formData;
};
