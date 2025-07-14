import { For, type VoidComponent } from "solid-js";
import { useForm } from "@stores/formStore";

import withUnit from "./withUnit";
import { sizes } from "@schemas/serviceSchema";

const SizeField: VoidComponent = () => {
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
};

export default withUnit(SizeField, "size");
