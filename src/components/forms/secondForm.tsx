import type { Component } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";
import type { ServiceDetailsSchema } from "@utils/schema";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface SecondFormPros extends ServiceDetailsSchema {
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: DOMElement;
        },
    ) => void;
}

// TODO: add photo upload

const SecondForm: Component<SecondFormPros> = ({
    serviceType,
    description,
    quantity,
    dimensions,
    unitType,
    updateFields,
}) => {
    return (
        <>
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
                required
            />
            <input
                type="number"
                name="quantity"
                value={quantity}
                onChange={updateFields}
                placeholder="Quantity"
                required
            />
            <div class="flex gap-x-4">
                <input
                    type="number"
                    name="dimensions"
                    value={dimensions}
                    onChange={updateFields}
                    placeholder="Dimensions"
                    required
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
        </>
    );
};

export default SecondForm;
