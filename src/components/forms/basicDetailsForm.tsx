import type { Component } from "solid-js";
import type { OrderSchema } from "@schemas/formSchema";
import { Field, type FormStore } from "@modular-forms/solid";

import SimpleLineIconsPhone from "@icons/sli/phone";

type Props = {
    form: FormStore<OrderSchema>;
};

const BasicDetailsForm: Component<Props> = (props) => {
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
                            "border-green-500": field.error === "" && !!field.value,
                        }}
                    />
                )}
            </Field>
            <Field of={props.form} name="fullname">
                {(field, fieldProps) => (
                    <input {...fieldProps} type="text" placeholder="Full Name" value={field.value} />
                )}
            </Field>
            <Field of={props.form} name="tel">
                {(field, fieldProps) => (
                    <div
                        class="flex items-center border border-gray-secondary transition-colors duration-300"
                        classList={{
                            "border-red-500": field.error !== "",
                            "border-green-500": field.error === "" && !!field.value,
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
