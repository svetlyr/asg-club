import type { VoidComponent } from "solid-js";
import { getForm } from "@stores/formStore";

const SizeField: VoidComponent = () => {
    const { form, Field } = getForm();

    return (
        <Field name="size">
            {(field, fp) => (
                <input
                    {...fp}
                    value={field.value}
                    required
                    placeholder="Size"
                    classList={{
                        "border-red-500": !!form.submitCount && !!field.error,
                        "border-green-500": !!form.submitCount && field.dirty && !field.error,
                    }}
                />
            )}
        </Field>
    );
};

export default SizeField;
