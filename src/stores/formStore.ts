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

import type { OrderSchema } from "@schemas/formSchema";

type CreateFormReturn = ReturnType<typeof createForm<OrderSchema>>;
type FormApi = CreateFormReturn[0];

type Components = CreateFormReturn[1];
type FormComponent = Components["Form"];
type FieldComponent = Components["Field"];

type FormOptions = MFormOptions<OrderSchema>;

type FormStore = {
    form: FormApi;
    Form: FormComponent;
    Field: FieldComponent;
};

let initialized = false;
let initialValues: OrderSchema;

const formStore = map<Partial<FormStore>>({});

// prettier-ignore
type InitFormOptions =
  Omit<FormOptions, "initialValues">
  & { initialValues: OrderSchema };

function initFormStore(opts: InitFormOptions): FormStore {
    if (initialized) throw new Error("FormStore already initialized");

    const [form, { Form, Field }] = createForm<OrderSchema>(opts);

    formStore.setKey("form", form);
    formStore.setKey("Form", Form);
    formStore.setKey("Field", Field);

    initialValues = opts.initialValues;
    initialized = true;

    return { form, Form, Field };
}

function getForm(): FormStore {
    const { form, Form, Field } = formStore.get();

    if (!form || !Form || !Field) throw new Error("FormStore has not been initialized");

    return { form, Form, Field };
}

function getFormValue<K extends keyof OrderSchema>(key: K, opts?: GetValueOptions): OrderSchema[K] {
    const { form } = formStore.get();

    if (!form) throw new Error("FormStore has not been initialized");

    const value = getValue(form, key, opts);

    return value ?? initialValues[key];
}

function setFormValue<K extends FieldPath<OrderSchema>>(key: K, value: FieldPathValue<OrderSchema, K>): void {
    const { form } = formStore.get();

    if (!form) throw new Error("FormStore has not been initialized");

    setValue(form, key, value);
}

export { initFormStore, type FormStore, getForm, getFormValue, setFormValue };
