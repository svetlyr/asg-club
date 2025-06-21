import { For, type Component } from "solid-js";

import { getForm } from "@stores/formStore";
import { unitTypes } from "@lib/serviceTypes";

const UnitTypeField: Component = () => {
    const { form, Field } = getForm();

    return (
        <Field name="unitType">
            {(field, fieldProps) => (
                <select
                    {...fieldProps}
                    required
                    value={field.value}
                    classList={{
                        "border-red-500": !!form.submitCount && !!field.error,
                        "border-green-500": !!form.submitCount && field.dirty && !field.error,
                    }}>
                    <For each={unitTypes}>
                        {(unit) => (
                            <option value={unit} selected={field.value === unit}>
                                {unit}
                            </option>
                        )}
                    </For>
                </select>
            )}
        </Field>
    );
};

export default UnitTypeField;
