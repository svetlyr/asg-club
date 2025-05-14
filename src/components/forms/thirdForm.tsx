import type { Component } from "solid-js";

type ThirdFormPros = {
    comments: string;
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: Element;
        },
    ) => void;
};

const ThirdForm: Component<ThirdFormPros> = ({ comments, updateFields }) => {
    return <textarea name="comments" value={comments} onChange={updateFields} placeholder="Comments" rows={6} />;
};

export default ThirdForm;
