import type { Component } from "solid-js";
import type { OrderSchema } from "@utils/schema";
import { Field, type FormStore } from "@modular-forms/solid";

type CommentsFormProps = {
    form: FormStore<OrderSchema>;
};

const CommentsForm: Component<CommentsFormProps> = (props) => {
    return (
        <Field of={props.form} name="comments">
            {(field, fieldProps) => (
                <textarea {...fieldProps} value={field.value} placeholder="Any special instructions?" rows={6} />
            )}
        </Field>
    );
};

export default CommentsForm;
