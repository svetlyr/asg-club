import type { Component } from "solid-js";
import { type Maybe } from "@modular-forms/solid";

import withUnit from "./withUnit";
import { getForm, setFormValue } from "@stores/formStore";

import Plus from "@icons/custom/plus";
import Menus from "@icons/custom/menus";
import Button from "@components/button";

const DimensionsField: Component = () => {
    const { form, Field } = getForm();

    function updateDimensions(value: Maybe<number>, delta: number): void {
        const current = value ?? 1;

        setFormValue("dimensions", Math.max(current + delta, 1));
    }

    return (
        <Field name="dimensions" type="number">
            {(field, fieldProps) => (
                <div class="flex w-full">
                    <Button
                        class="h-12 border border-r-0 border-gray-secondary focus:outline-none"
                        onClick={() => updateDimensions(field.value, -1)}>
                        <Menus />
                    </Button>
                    <input
                        {...fieldProps}
                        required
                        type="number"
                        value={field.value}
                        placeholder="Dimensions"
                        classList={{
                            "border-red-500": !!form.submitCount && !!field.error,
                            "border-green-500": !!form.submitCount && field.dirty && !field.error,
                        }}
                    />
                    <Button
                        class="h-12 border border-l-0 border-gray-secondary focus:outline-none"
                        onClick={() => updateDimensions(field.value, 1)}>
                        <Plus />
                    </Button>
                </div>
            )}
        </Field>
    );
};

export default withUnit(DimensionsField);
