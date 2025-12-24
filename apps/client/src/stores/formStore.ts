import { map } from "nanostores";
import {
    createForm,
    getValue,
    setValue,
    type FieldPath,
    type FieldPathValue,
    type GetValueOptions,
    type FormOptions as MFormOptions,
} from "@modular-forms/solid";

import { orderDefaults, type OrderSchema } from "@schemas/formSchema";

type CreateFormReturn = ReturnType<typeof createForm<OrderSchema>>;
type FormApi = CreateFormReturn[0];
type Components = CreateFormReturn[1];
type FormComponent = Components["Form"];
type FieldComponent = Components["Field"];
export type FieldComponentProps = Parameters<FieldComponent>[0];

export type FormStore = {
    form: FormApi;
    Form: FormComponent;
    Field: FieldComponent;
};

type InitFormOptions = MFormOptions<OrderSchema>;

const formStore = map<Partial<FormStore>>({});

export function useForm(opts?: InitFormOptions): FormStore {
    const currentStore = formStore.get();

    if (currentStore.form) {
        return currentStore as FormStore;
    }

    const [form, { Form, Field }] = createForm<OrderSchema>(opts);
    formStore.set({ form, Form, Field });

    return formStore.get() as FormStore;
}

export function useFormValue<K extends FieldPath<OrderSchema>>(key: K, opts?: GetValueOptions): OrderSchema[K] {
    const { form } = formStore.get();
    if (!form) {
        throw new Error("FormStore not initialized. Ensure `useForm` is called in a parent component.");
    }

    const value = getValue(form, key, opts);

    return value ?? orderDefaults[key];
}

export function setFormValue<K extends FieldPath<OrderSchema>>(key: K, value: FieldPathValue<OrderSchema, K>): void {
    const { form } = formStore.get();
    if (!form) {
        throw new Error("FormStore not initialized. Ensure `useForm` is called in a parent component.");
    }

    setValue(form, key, value);
}
