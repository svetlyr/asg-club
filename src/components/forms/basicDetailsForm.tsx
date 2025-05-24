import type { Component } from "solid-js";
import SimpleLineIconsPhone from "@icons/sli/phone";
import type { OrderSchema } from "@utils/schema";
import { Field, type FormStore } from "@modular-forms/solid";

type BasicDetailsFormProps = {
    form: FormStore<OrderSchema>;
};

const BasicDetailsForm: Component<BasicDetailsFormProps> = (props) => {
    return (
        <>
            <Field of={props.form} name="email">
                {(field, fieldProps) => (
                    <input
                        {...fieldProps}
                        type="email"
                        placeholder="Email"
                        value={field.value}
                        required
                        class="transition-colors duration-300"
                        classList={{
                            "border-red-500": field.error !== "",
                            "border-green-500":
                                field.error !== "" && field.value !== undefined && field.value.trim() !== "",
                        }}
                    />
                )}
            </Field>
            <Field of={props.form} name="fullname">
                {(field, fieldProps) => (
                    <input
                        {...fieldProps}
                        class="transition-colors duration-300"
                        classList={{
                            "border-red-500": field.error !== "",
                            "border-green-500":
                                field.error !== "" && field.value !== undefined && field.value.trim() !== "",
                        }}
                        type="text"
                        placeholder="Full Name"
                        value={field.value}
                        pattern="^[A-Za-zА-Яа-я]{2,}(?:\s+[A-Za-zА-Яа-я]{2,})+$"
                        required
                    />
                )}
            </Field>
            <Field of={props.form} name="tel">
                {(field, fieldProps) => (
                    <div
                        class="flex items-center border border-[#ffffff40] transition-colors duration-300"
                        classList={{
                            "border-red-500": field.error !== "",
                            "border-green-500":
                                field.error !== "" && field.value !== undefined && field.value.trim() !== "",
                        }}>
                        <SimpleLineIconsPhone class="ml-3 text-gray-primary" />
                        <input
                            {...fieldProps}
                            type="tel"
                            value={field.value}
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
