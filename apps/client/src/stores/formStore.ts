import { atom } from "nanostores";
import {
    createForm,
    getErrors,
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
    errors: () => Record<string, string | undefined>;
};

type InitFormOptions = MFormOptions<OrderSchema>;

const formStore = atom<FormStore | null>(null);

export function useForm(opts?: InitFormOptions): FormStore {
    const store = formStore.get();
    if (store) return store;

    const [form, { Form, Field }] = createForm<OrderSchema>(opts);
    const next = { form, Form, Field, errors: () => getErrors(form) };

    return (formStore.set(next), next);
}

export function useFormValue<K extends FieldPath<OrderSchema>>(key: K, opts?: GetValueOptions): OrderSchema[K] {
    const { form } = formStore.get() ?? {};
    if (!form) {
        throw new Error("FormStore not initialized. Ensure `useForm` is called in a parent component.");
    }

    const value = getValue(form, key, opts);

    return value ?? orderDefaults[key];
}

export function setFormValue<K extends FieldPath<OrderSchema>>(key: K, value: FieldPathValue<OrderSchema, K>): void {
    const { form } = formStore.get() ?? {};
    if (!form) {
        throw new Error("FormStore not initialized. Ensure `useForm` is called in a parent component.");
    }

    setValue(form, key, value);
}
