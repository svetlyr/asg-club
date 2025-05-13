import type { Component } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";
import type { BasicDetailsSchema } from "@utils/schema";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface FirstFormProps extends BasicDetailsSchema {
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: DOMElement;
        },
    ) => void;
}

const FirstForm: Component<FirstFormProps> = ({ email, fullname, tel, updateFields }) => {
    return (
        <>
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
            <div>
                <input
                    type="tel"
                    value={tel}
                    onChange={updateFields}
                    name="tel"
                    placeholder="Phone Number (Optional)"
                />
            </div>
        </>
    );
};

export default FirstForm;
