import type { Component } from "solid-js";
import { useForm } from "@stores/formStore";
import { FieldControl } from "./fields/fieldControl";

export const CommentsForm: Component = () => {
    const { Field } = useForm();

    return (
        <Field name="comments">
            {(field, fieldProps) => (
                <FieldControl field={field} fieldProps={fieldProps} placeholder="Any special instructions?" rows={6} />
            )}
        </Field>
    );
};
