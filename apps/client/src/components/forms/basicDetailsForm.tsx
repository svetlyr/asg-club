import type { Component } from "solid-js";
import { getForm } from "@stores/formStore";

import PhoneIcon from "@icons/sli/phone";

const BasicDetailsForm: Component = () => {
    const { form, Field } = getForm();

    return (
        <>
            <Field name="email" keepActive>
                {(field, fieldProps) => (
                    <input
                        {...fieldProps}
                        required
                        value={field.value}
                        type="email"
                        placeholder="Email"
                        class="transition-colors duration-300"
                        classList={{
                            "border-red-500": !!form.submitCount && !!field.error,
                            "border-green-500": !!form.submitCount && field.dirty && !field.error,
                        }}
                    />
                )}
            </Field>
            <Field name="fullname" keepActive>
                {(field, fieldProps) => (
                    <input
                        {...fieldProps}
                        value={field.value}
                        type="text"
                        placeholder="Full Name"
                        class="transition-colors duration-300"
                        classList={{
                            "border-red-500": !!form.submitCount && !!field.error,
                            "border-green-500": !!form.submitCount && field.dirty && !field.error,
                        }}
                    />
                )}
            </Field>
            <Field name="tel" keepActive>
                {(field, fieldProps) => (
                    <div
                        class="flex items-center border border-gray-secondary transition-colors duration-300"
                        classList={{
                            "border-red-500": Boolean(field.error),
                            "border-green-500": !field.error && Boolean(field.value),
                        }}>
                        <PhoneIcon class="ml-3 text-gray-primary" />
                        <input
                            {...fieldProps}
                            value={field.value}
                            type="tel"
                            class="flex-1 border-none"
                            placeholder="123-456-7890 (Optional)"
                        />
                    </div>
                )}
            </Field>
        </>
    );
};

export default BasicDetailsForm;
