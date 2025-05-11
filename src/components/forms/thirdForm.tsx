import type { Component } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";

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
        <textarea name="comments" value={comments} onChange={updateFields} placeholder="Comments" rows={6}></textarea>
    );
};

export default ThirdForm;
