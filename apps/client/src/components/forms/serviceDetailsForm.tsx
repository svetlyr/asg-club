import { Dynamic } from "solid-js/web";
import { createMemo, For } from "solid-js";
import type { Component, VoidComponent } from "solid-js";

import { useFormValue, useForm } from "@stores/formStore";
import { serviceTypes, uiSchemaFields, type MeasurementKey, type UiSchemaFieldKey } from "@schemas/serviceSchema";

import SizeField from "./fields/SizeField";
import QuantityField from "./fields/QuantityField";
import DimensionsField from "./fields/DimensionsField";
import type { WithUnitComponent } from "./fields/withUnit";

type FieldMapType = {
    [K in UiSchemaFieldKey]: K extends MeasurementKey ? WithUnitComponent : Component;
};

const fieldMap = {
    size: SizeField,
    quantity: QuantityField,
    dimensions: DimensionsField,
} satisfies FieldMapType;

const AdditionalFields: Component = () => {
    const serviceType = createMemo(() => useFormValue("serviceType"));

    return <For each={uiSchemaFields[serviceType()]}>{(fieldKey) => <Dynamic component={fieldMap[fieldKey]} />}</For>;
};

const ServiceDetailsForm: VoidComponent = () => {
    const { form, Field } = useForm();

    return (
        <>
            <Field name="serviceType" keepActive>
                {(field, fieldProps) => (
                    <select {...fieldProps}>
                        <For each={serviceTypes}>
                            {(service) => (
                                <option value={service} selected={field.value === service}>
                                    {service === "Mugs" ? "Mugs (250-300 ml)" : service}
                                </option>
                            )}
                        </For>
                    </select>
                )}
            </Field>

            <Field name="description" keepActive>
                {(field, fieldProps) => (
                    <textarea
                        {...fieldProps}
                        required
                        value={field.value}
                        classList={{
                            "border-red-500": !!form.submitCount && !!field.error,
                            "border-green-500": !!form.submitCount && field.dirty && !field.error,
                        }}
                        rows={7}
                        placeholder="Description of what you want. Please be as detailed as possible, since it will help us understand you better. Minimum 10 characters required."
                    />
                )}
            </Field>

            <Field name="url" keepActive>
                {(field, fieldProps) => (
                    <input
                        {...fieldProps}
                        value={field.value}
                        classList={{
                            "border-red-500": !!form.submitCount && !!field.error,
                            "border-green-500": !!form.submitCount && field.dirty && !field.error,
                        }}
                        type="url"
                        placeholder="URL (optional). Provide a link if you have a specific design or style in mind."
                    />
                )}
            </Field>

            <AdditionalFields />
        </>
    );
};

export default ServiceDetailsForm;
