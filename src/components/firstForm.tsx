import type { Component } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";
import type { OrderNameSchema } from "@utils/schema";

import FormWrapper from "./formWrapper";

interface FirstFormPros extends OrderNameSchema {
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: DOMElement;
        },
    ) => void;
}

const FirstForm: Component<FirstFormPros> = ({ email, fullname, tel, updateFields }) => {
    return (
        <FormWrapper
            title="Order"
            paragraph="Don't wait. Just fill the form below with your desires related to our services and we'll do our best to make your wishes come true. Please fill in all requested fields for best results."
            imageName="coffee2">
            <input type="email" value={email} onChange={updateFields} name="email" placeholder="Email" required />
            <input
                type="text"
                value={fullname}
                onChange={updateFields}
                name="fullname"
                placeholder="Full Name"
                pattern="^[A-Za-zА-Яа-я]{2,}(?:\s+[A-Za-zА-Яа-я]{2,})+$"
                required
            />
            <input type="tel" value={tel} onChange={updateFields} name="tel" placeholder="Phone Number (Optional)" />
        </FormWrapper>
    );
};

export default FirstForm;
