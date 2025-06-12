/* eslint-disable solid/reactivity */
import { For, type Component } from "solid-js";
import { serviceType, type OrderSchema } from "@schemas/formSchema";
import { Field, setValue, type FormStore, type Maybe } from "@modular-forms/solid";

import Plus from "@icons/custom/plus";
import Menus from "@icons/custom/menus";

import Button from "@components/button";

type Props = {
    form: FormStore<OrderSchema>;
};

function makeDeltaUpdater(form: FormStore<OrderSchema>, fieldName: "quantity" | "dimensions") {
    return (value: Maybe<number>, delta: number): void => {
        const current = value ?? 1;
        const next = Math.max(current + delta, 1);
        setValue(form, fieldName, next);
    };
}

// TODO: add photo upload

const ServiceDetailsForm: Component<Props> = (props) => {
    const updateQuantity = makeDeltaUpdater(props.form, "quantity");
    const updateDimensions = makeDeltaUpdater(props.form, "dimensions");

    return (
        <>
            <Field of={props.form} name="serviceType">
                {(field, fieldProps) => (
                    <select {...fieldProps}>
                        <For each={serviceType}>
                            {(value) => (
                                <option value={value} selected={field.value === value}>
                                    {value}
                                </option>
                            )}
                        </For>
                    </select>
                )}
            </Field>

            <Field of={props.form} name="description">
                {({ value, error }, fieldProps) => (
                    <textarea
                        {...fieldProps}
                        classList={{
                            "border-red-500": error !== "",
                            "border-green-500": error === "" && !!value,
                        }}
                        value={value}
                        rows={7}
                        placeholder="URL of the design or a description of what you want. Please be as detailed as possible, since it will help us understand you better."
                        required
                    />
                )}
            </Field>

            <Field of={props.form} name="quantity" type="number">
                {({ value }, fieldProps) => (
                    <div class="flex">
                        <Button
                            class={"h-12 border border-r-0 border-gray-secondary focus:outline-none"}
                            onClick={() => updateQuantity(value, -1)}>
                            <Menus />
                        </Button>
                        <input {...fieldProps} type="number" value={value} placeholder="Quantity" required />
                        <Button
                            class={"h-12 border border-l-0 border-gray-secondary focus:outline-none"}
                            onClick={() => updateQuantity(value, 1)}>
                            <Plus />
                        </Button>
                    </div>
                )}
            </Field>

            <div class="flex gap-x-4">
                <Field of={props.form} name="dimensions" type="number">
                    {({ value }, fieldProps) => (
                        <div class="flex w-full">
                            <Button
                                class={"h-12 border border-r-0 border-gray-secondary focus:outline-none"}
                                onClick={() => updateDimensions(value, -1)}>
                                <Menus />
                            </Button>
                            <input {...fieldProps} type="number" value={value} placeholder="Dimensions" required />
                            <Button
                                class={"h-12 border border-l-0 border-gray-secondary focus:outline-none"}
                                onClick={() => updateDimensions(value, 1)}>
                                <Plus />
                            </Button>
                        </div>
                    )}
                </Field>

                <Field of={props.form} name="unitType">
                    {({ value }, fieldProps) => (
                        <select class="max-w-fit" {...fieldProps} value={value}>
                            <option value="cm">cm</option>
                            <option value="inch">inch</option>
                        </select>
                    )}
                </Field>
            </div>
        </>
    );
};

export default ServiceDetailsForm;
