import type { VoidComponent } from "solid-js";
import { createFileUploader } from "@solid-primitives/upload";
import { createEffect, createMemo, For, on, Show } from "solid-js";
import { getErrors, getValues, setValue, valiField } from "@modular-forms/solid";

import { toast } from "@stores/toastStore";
import { filesSchema } from "@schemas/serviceSchema";
import { fileTypes, serviceTypes } from "@constants";
import { useFormValue, useForm } from "@stores/formStore";
import { AdditionalFields } from "./additionalServiceFields";

import { Docs } from "@components/icons";

const ServiceDetailsForm: VoidComponent = () => {
    const { form, Field } = useForm();
    const serviceType = createMemo(() => useFormValue("serviceType"));
    const { files, selectFiles } = createFileUploader({ multiple: true, accept: fileTypes.join(",") });

    const handleSelectFile = (): void => {
        selectFiles((uploads) => {
            const nextFiles = uploads.map((u) => u.file);

            setValue(form, "files", nextFiles, { shouldValidate: true });
        });
    };

    createEffect(
        on(
            () => getErrors(form).files,
            () => {
                // TODO: refactor into helper
                requestAnimationFrame(() => {
                    const errors = Object.values(getErrors(form)).filter(Boolean);

                    errors.forEach((msg, i) => setTimeout(() => toast.info(msg), 300 * i));
                });
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        console.log("form", getValues(form));
        console.log("files", files());
    });

    return (
        <>
            <Field name="serviceType" keepActive>
                {(field, fieldProps) => (
                    <select {...fieldProps}>
                        <For each={serviceTypes}>
                            {(service) => (
                                <option value={service} selected={field.value === service}>
                                    {service === "Mugs" ? "Mugs (250-300 ml)" : service}
                                </option>
                            )}
                        </For>
                    </select>
                )}
            </Field>

            <Field name="description" keepActive>
                {(field, fieldProps) => (
                    <textarea
                        {...fieldProps}
                        value={field.value}
                        classList={{
                            "border-red-500": !!field.error,
                            "border-green-500": field.dirty && !field.error,
                        }}
                        rows={7}
                        placeholder="Description of what you want. Please be as detailed as possible, since it will help us understand you better. Minimum 10 characters required."
                    />
                )}
            </Field>
            {
                // TODO: styles
            }
            <Show when={serviceType() !== "Premade Merch"}>
                <Field name="files" type="File[]" keepActive validate={valiField(filesSchema)}>
                    {() => (
                        <>
                            <button onClick={handleSelectFile} type="button">
                                <Docs /> Select Files
                            </button>
                        </>
                    )}
                </Field>

                <Field name="url" keepActive>
                    {(field, fieldProps) => (
                        <input
                            {...fieldProps}
                            value={field.value}
                            classList={{
                                "border-red-500": !!field.error,
                                "border-green-500": field.dirty && !field.error,
                            }}
                            type="url"
                            placeholder="URL (optional). Provide a link if you have a specific design or style in mind."
                        />
                    )}
                </Field>

                <AdditionalFields />
            </Show>
        </>
    );
};

export default ServiceDetailsForm;
