import type { Component } from "solid-js";
import { getForm } from "@stores/formStore";

const CommentsForm: Component = () => {
    const { Field } = getForm();

    return (
        <Field name="comments">
            {(field, fieldProps) => (
                <textarea {...fieldProps} value={field.value} placeholder="Any special instructions?" rows={6} />
            )}
        </Field>
    );
};

export default CommentsForm;
