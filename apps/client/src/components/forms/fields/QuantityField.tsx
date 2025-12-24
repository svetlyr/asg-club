import { type VoidComponent } from "solid-js";
import { type Maybe } from "@modular-forms/solid";

import { Button } from "@components/button";
import { Plus, Menus } from "@components/icons";
import { handleKeyDown, handlePaste } from "./handlers";
import { useForm, setFormValue } from "@stores/formStore";

export const QuantityField: VoidComponent = () => {
    const { form, Field } = useForm();

    function updateQuantity(value: Maybe<number>, delta: number): void {
        const current = value || 0;

        setFormValue("quantity", Math.max(current + delta, 0));
    }

    return (
        <Field name="quantity" type="number" keepActive>
            {(field, fieldProps) => (
                <div class="flex">
                    <Button
                        class={"h-12 border border-r-0 border-gray-secondary focus:outline-none"}
                        onClick={() => updateQuantity(field.value, -1)}>
                        <Menus />
                    </Button>
                    <input
                        {...fieldProps}
                        required
                        type="number"
                        placeholder="Quantity"
                        value={field.value === 0 ? "" : field.value}
                        onPaste={handlePaste}
                        onKeyDown={handleKeyDown}
                        classList={{
                            "border-red-500": !!form.submitCount && !!field.error,
                            "border-green-500": !!form.submitCount && field.dirty && !field.error,
                        }}
                    />
                    <Button
                        class={"h-12 border border-l-0 border-gray-secondary focus:outline-none"}
                        onClick={() => updateQuantity(field.value, 1)}>
                        <Plus />
                    </Button>
                </div>
            )}
        </Field>
    );
};
