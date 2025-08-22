import type { Component } from "solid-js";
import { type Maybe } from "@modular-forms/solid";

import withUnit from "./withUnit";
import Button from "@components/button";
import { handleNumberTransform } from "@utils/form";
import { handleKeyDown, handlePaste } from "./handlers";
import { setFormValue, useForm } from "@stores/formStore";

import Plus from "@icons/custom/plus";
import Menus from "@icons/custom/menus";

const DimensionsField: Component = () => {
    const { form, Field } = useForm();

    function updateDimension(key: "width" | "height", value: Maybe<number>, delta: number): void {
        const current = value || 0;

        setFormValue(key, Math.max(current + delta, 0));
    }

    return (
        <>
            <Field name="width" type="number" keepActive transform={handleNumberTransform}>
                {(field, fieldProps) => (
                    <div class="flex w-full">
                        <Button
                            class="h-12 border border-r-0 border-gray-secondary"
                            onClick={() => updateDimension("width", field.value, -1)}>
                            <Menus />
                        </Button>
                        <input
                            {...fieldProps}
                            required
                            type="number"
                            value={field.value === 0 ? "" : field.value}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            placeholder="Width"
                            classList={{
                                "border-red-500": !!form.submitCount && !!field.error,
                                "border-green-500": !!form.submitCount && field.dirty && !field.error,
                            }}
                        />
                        <Button
                            class="h-12 border border-l-0 border-gray-secondary"
                            onClick={() => updateDimension("width", field.value, 1)}>
                            <Plus />
                        </Button>
                    </div>
                )}
            </Field>

            <Field name="height" type="number" keepActive>
                {(field, fieldProps) => (
                    <div class="flex w-full">
                        <Button
                            class="h-12 border border-r-0 border-gray-secondary"
                            onClick={() => updateDimension("height", field.value, -1)}>
                            <Menus />
                        </Button>
                        <input
                            {...fieldProps}
                            required
                            type="number"
                            value={field.value === 0 ? "" : field.value}
                            placeholder="Height"
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            classList={{
                                "border-red-500": !!form.submitCount && !!field.error,
                                "border-green-500": !!form.submitCount && field.dirty && !field.error,
                            }}
                        />
                        <Button
                            class="h-12 border border-l-0 border-gray-secondary"
                            onClick={() => updateDimension("height", field.value, 1)}>
                            <Plus />
                        </Button>
                    </div>
                )}
            </Field>
        </>
    );
};

export default withUnit(DimensionsField, "dimensions");
