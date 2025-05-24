import Button from "@components/button";
import type { Component } from "solid-js";
import type { OrderSchema } from "@utils/schema";
import { Field, setValue, type FormStore, type Maybe } from "@modular-forms/solid";

type ServiceDetailsFormProps = {
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

const ServiceDetailsForm: Component<ServiceDetailsFormProps> = (props) => {
    const updateQuantity = makeDeltaUpdater(props.form, "quantity");
    const updateDimensions = makeDeltaUpdater(props.form, "dimensions");

    return (
        <>
            <Field of={props.form} name="serviceType">
                {(field, fieldProps) => (
                    <select {...fieldProps} value={field.value}>
                        <option value="Decals">Decals</option>
                        <option value="Jacket Pins">Jacket Pins</option>
                        <option value="Merch">Merch</option>
                    </select>
                )}
            </Field>

            <Field of={props.form} name="description">
                {(field, fieldProps) => (
                    <textarea
                        {...fieldProps}
                        classList={{
                            "border-red-500": field.error !== "",
                            "border-green-500":
                                field.error !== "" && field.value !== undefined && field.value.trim() !== "",
                        }}
                        value={field.value}
                        rows={7}
                        placeholder="URL of the design or a description of what you want. Please be as detailed as possible, since it will help us understand you better."
                        required
                    />
                )}
            </Field>

            <Field of={props.form} name="quantity" type="number">
                {(field, fieldProps) => (
                    <div class="flex">
                        <Button
                            class={"h-12 border border-r-0 border-[#ffffff40] focus:outline-none"}
                            onClick={() => updateQuantity(field.value, -1)}>
                            <svg
                                class="size-3 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2">
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 1h16"
                                />
                            </svg>
                        </Button>
                        <input {...fieldProps} type="number" value={field.value} placeholder="Quantity" required />
                        <Button
                            class={"h-12 border border-l-0 border-[#ffffff40] focus:outline-none"}
                            onClick={() => updateQuantity(field.value, 1)}>
                            <svg
                                class="size-3 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18">
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 1v16M1 9h16"
                                />
                            </svg>
                        </Button>
                    </div>
                )}
            </Field>

            <div class="flex gap-x-4">
                <Field of={props.form} name="dimensions" type="number">
                    {(field, fieldProps) => (
                        <div class="flex w-full">
                            <Button
                                class={"h-12 border border-r-0 border-[#ffffff40] focus:outline-none"}
                                onClick={() => updateDimensions(field.value, -1)}>
                                <svg
                                    class="size-3 text-gray-900 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 2">
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M1 1h16"
                                    />
                                </svg>
                            </Button>
                            <input
                                {...fieldProps}
                                type="number"
                                value={field.value}
                                placeholder="Dimensions"
                                required
                            />
                            <Button
                                class={"h-12 border border-l-0 border-[#ffffff40] focus:outline-none"}
                                onClick={() => updateDimensions(field.value, 1)}>
                                <svg
                                    class="size-3 text-gray-900 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18">
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 1v16M1 9h16"
                                    />
                                </svg>
                            </Button>
                        </div>
                    )}
                </Field>

                <Field of={props.form} name="unitType">
                    {(field, fieldProps) => (
                        <select class="max-w-fit" {...fieldProps} value={field.value}>
                            <option value="cm">cm</option>
                            <option value="inch">inch</option>
                        </select>
                    )}
                </Field>
            </div>
            <div class="flex gap-x-4">
                <input class="w-3" type="checkbox" name="terms" required />
                <p class="">I have read and agree with the Terms of Use.</p>
            </div>
        </>
    );
};

export default ServiceDetailsForm;
