import type { Component } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";
import type { OrderDetailsSchema } from "@utils/schema";

import FormWrapper from "./formWrapper";

interface SecondFormPros extends OrderDetailsSchema {
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: DOMElement;
        },
    ) => void;
}

const SecondForm: Component<SecondFormPros> = ({
    serviceType,
    description,
    quantity,
    dimensions,
    unitType,
    updateFields,
}) => {
    return (
        <FormWrapper
            title="Details"
            paragraph="We need some important information to understand the basics of your order and have a better idea of what you want."
            imageName="bike2">
            <select name="serviceType" value={serviceType} onChange={updateFields}>
                <option value="Decals">Decals</option>
                <option value="Jacket Pins">Jacket Pins</option>
                <option value="Merch">Merch</option>
            </select>
            <textarea
                name="description"
                value={description}
                onChange={updateFields}
                rows={3}
                placeholder="Description"
            />
            <input type="number" name="quantity" value={quantity} onChange={updateFields} placeholder="Quantity" />
            <div class="flex gap-x-4">
                <input
                    type="number"
                    name="dimensions"
                    value={dimensions}
                    onChange={updateFields}
                    placeholder="Dimensions"
                />
                <select name="unitType" value={unitType} onChange={updateFields}>
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                </select>
            </div>
            <div class="flex gap-x-4">
                <input type="checkbox" name="terms" />
                <p>I have read and agree with the Terms of Use.</p>
            </div>
        </FormWrapper>
    );
};

export default SecondForm;
