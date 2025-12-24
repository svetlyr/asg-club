import { For } from "solid-js";
import { useForm } from "@stores/formStore";

import { sizes } from "@constants";
import { withUnit } from "./withUnit";

export const SizeField = withUnit(() => {
    const { Field } = useForm();

    return (
        <Field name="size" keepActive>
            {(field, fieldProps) => (
                <select {...fieldProps}>
                    <For each={sizes}>
                        {(size) => (
                            <option value={size} selected={field.value === size}>
                                {size}
                            </option>
                        )}
                    </For>
                </select>
            )}
        </Field>
    );
}, "size");
