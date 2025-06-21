import { Dynamic } from "solid-js/web";
import { createMemo, For } from "solid-js";
import type { Component, VoidComponent } from "solid-js";

import { getForm, getFormValue } from "@stores/formStore";
import { additionalServiceFields, serviceTypes, type AdditionalFieldKey, type MeasurementKey } from "@lib/serviceTypes";

import SizeField from "./fields/SizeField";
import QuantityField from "./fields/QuantityField";
import DimensionsField from "./fields/DimensionsField";
import type { WithUnitComponent } from "./fields/withUnit";

type FieldMapType = {
    [K in AdditionalFieldKey]: K extends MeasurementKey ? WithUnitComponent : Component;
};

const fieldMap = {
    size: SizeField,
    quantity: QuantityField,
    dimensions: DimensionsField,
} satisfies FieldMapType;

const AdditionalFields: Component = () => {
    const serviceType = createMemo(() => getFormValue("serviceType"));

    return (
        <For each={additionalServiceFields[serviceType()]}>
            {(fieldKey) => <Dynamic component={fieldMap[fieldKey]} />}
        </For>
    );
};

const ServiceDetailsForm: VoidComponent = () => {
    const { form, Field } = getForm();

    return (
        <>
            <Field name="serviceType">
                {(field, fieldProps) => (
                    <select {...fieldProps}>
                        <For each={serviceTypes}>
                            {(service) => (
                                <option value={service} selected={field.value === service}>
                                    {service}
                                </option>
                            )}
                        </For>
                    </select>
                )}
            </Field>

            <Field name="description">
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

            <AdditionalFields />
        </>
    );
};

export default ServiceDetailsForm;
