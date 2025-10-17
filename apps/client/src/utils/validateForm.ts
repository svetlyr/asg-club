import { type Accessor } from "solid-js";
import { valiForm, type ValidateForm, type FormErrors } from "@modular-forms/solid";

import { getServiceDetailsSchema } from "@schemas/serviceSchema";
import { type OrderSchema, basicDetailsSchema, orderSchema } from "@schemas/formSchema";

export function makeValidateForm(stepIndex: Accessor<number>): ValidateForm<OrderSchema> {
    return (values) => {
        switch (stepIndex()) {
            case 0:
                return valiForm(basicDetailsSchema)(values);

            case 1: {
                // * cant be undefined since we set initialValues
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const schema = getServiceDetailsSchema(values.serviceType!);
                return valiForm(schema)(values);
            }

            case 2:
                return valiForm(orderSchema)(values);

            default:
                return {} as FormErrors<OrderSchema>;
        }
    };
}
