/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type VoidComponent } from "solid-js";
import { createFileUploader } from "@solid-primitives/upload";
import { createEffect, createMemo, For, on, Show } from "solid-js";
import { clearError, getErrors, setValue, valiField, valiForm } from "@modular-forms/solid";

import { filesSchema } from "@schemas/serviceSchema";
import { fileTypes, serviceTypes } from "@constants";
import { toast } from "@stores/toastStore";
import { useFormValue, useForm } from "@stores/formStore";
import { AdditionalServiceFields } from "./additionalServiceFields";

import { Docs } from "@components/icons";
import { Button } from "@components/button";
import { FieldControl } from "./fields/fieldControl";

export const ServiceDetailsForm: VoidComponent = () => {
    const { form, errors, Field } = useForm();
    const serviceType = createMemo(() => useFormValue("serviceType"));
    const { selectFiles, files, clearFiles, removeFile } = createFileUploader({
        multiple: true,
        accept: fileTypes.join(","),
    });

    // TODO: delete files after validation fail
    const handleSelectFile = (): void => {
        selectFiles((uploads) => {
            const files = uploads.map((u) => u.file);

            setValue(form, "files", files, { shouldValidate: true });
        });
    };

    // ? stale closure, old msg is still there
    const handleErrors = (msg?: string) => {
        console.log("errors", msg);

        toast.info(msg);
        clearFiles();
        clearError(form, "files");
        console.log(errors());
    };
    createEffect(on(() => errors().files, handleErrors, { defer: true }));

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
                    <FieldControl
                        rows={7}
                        as="textarea"
                        field={field}
                        fieldProps={fieldProps}
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
                        <Button onClick={handleSelectFile} class="flex items-center md:px-6">
                            <Docs class="mr-4" />
                            <span class="text-sm md:text-base">Select Files</span>
                        </Button>
                    )}
                </Field>

                <Field name="url" keepActive>
                    {(field, fieldProps) => (
                        <FieldControl
                            type="url"
                            field={field}
                            fieldProps={fieldProps}
                            placeholder="URL (optional). Provide a link if you have a specific design or style in mind."
                        />
                    )}
                </Field>

                <AdditionalServiceFields />
            </Show>
        </>
    );
};
