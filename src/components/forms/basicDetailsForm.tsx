import type { Component } from "solid-js";
import type { OrderSchema } from "@schemas/formSchema";
import { Field, type FormStore } from "@modular-forms/solid";

import PhoneIcon from "@icons/sli/phone";

type Props = {
    form: FormStore<OrderSchema>;
};

const BasicDetailsForm: Component<Props> = (props) => {
    return (
        <>
            <Field of={props.form} name="email">
                {({ value, error }, fieldProps) => (
                    <input
                        {...fieldProps}
                        type="email"
                        placeholder="Email"
                        value={value}
                        required
                        class="transition-colors duration-300"
                        classList={{
                            "border-red-500": error !== "",
                            "border-green-500": error === "" && !!value,
                        }}
                    />
                )}
            </Field>
            <Field of={props.form} name="fullname">
                {({ value }, fieldProps) => <input {...fieldProps} type="text" placeholder="Full Name" value={value} />}
            </Field>
            <Field of={props.form} name="tel">
                {({ value, error }, fieldProps) => (
                    <div
                        class="flex items-center border border-gray-secondary transition-colors duration-300"
                        classList={{
                            "border-red-500": error !== "",
                            "border-green-500": error === "" && !!value,
                        }}>
                        <PhoneIcon class="ml-3 text-gray-primary" />
                        <input
                            {...fieldProps}
                            type="tel"
                            value={value}
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
