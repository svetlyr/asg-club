import type { Component } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";

import FormWrapper from "./formWrapper";

interface ThirdFormPros {
    comments: string;
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: DOMElement;
        },
    ) => void;
}

const ThirdForm: Component<ThirdFormPros> = ({ comments, updateFields }) => {
    return (
        <FormWrapper title="Amost Done" paragraph="Comments" imageName="bike3">
            <textarea
                name="comments"
                value={comments}
                onChange={updateFields}
                placeholder="Comments"
                rows={6}></textarea>
        </FormWrapper>
    );
};

export default ThirdForm;
