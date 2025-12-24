import { For, type Component } from "solid-js";

import { useForm } from "@stores/formStore";
import { unitTypes, type UnitTypeKey } from "@constants";

type Props = {
    fieldKey: UnitTypeKey;
};

export const UnitTypeField: Component<Props> = (props) => {
    const { form, Field } = useForm();

    return (
        <Field name="unitType" keepActive>
            {(field, fieldProps) => (
                <select
                    class="w-min"
                    {...fieldProps}
                    required
                    value={field.value}
                    classList={{
                        "border-red-500": !!form.submitCount && !!field.error,
                        "border-green-500": !!form.submitCount && field.dirty && !field.error,
                    }}>
                    <For each={unitTypes[props.fieldKey]}>
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
