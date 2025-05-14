import type { Component } from "solid-js";
import type { ServiceDetailsSchema } from "@utils/schema";
import Button from "@components/button";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface SecondFormPros extends ServiceDetailsSchema {
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: Element;
        },
    ) => void;
}

// TODO: add photo upload

const SecondForm: Component<SecondFormPros> = (props) => {
    const handleDelta = (field: "quantity" | "dimensions", delta: number): void => {
        const current = Number(props[field]) || 0;
        const next = Math.max(current + delta, 1);

        const syntheticEvent = {
            currentTarget: {
                name: field,
                value: String(next),
            } as HTMLInputElement,
        } as Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: Element;
        };

        props.updateFields(syntheticEvent);
    };

    return (
        <>
            <select name="serviceType" value={props.serviceType} onChange={() => props.updateFields}>
                <option value="Decals">Decals</option>
                <option value="Jacket Pins">Jacket Pins</option>
                <option value="Merch">Merch</option>
            </select>
            <textarea
                name="description"
                value={props.description}
                onChange={() => props.updateFields}
                rows={3}
                placeholder="Description"
                required
            />
            <div class="flex">
                <Button
                    class={"border border-r-0 border-[#ffffff40] focus:outline-none"}
                    onClick={() => handleDelta("quantity", -1)}>
                    <svg
                        class="size-3 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 2">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 1h16"
                        />
                    </svg>
                </Button>
                <input
                    class="w-full"
                    type="number"
                    name="quantity"
                    value={props.quantity}
                    onChange={() => props.updateFields}
                    placeholder="Quantity"
                    required
                />
                <Button
                    class={"h-12 border border-l-0 border-[#ffffff40] focus:outline-none"}
                    onClick={() => handleDelta("quantity", +1)}>
                    <svg
                        class="size-3 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 1v16M1 9h16"
                        />
                    </svg>
                </Button>
            </div>
            <div class="flex gap-x-4">
                <div class="flex w-full">
                    <Button
                        class={"border border-r-0 border-[#ffffff40] focus:outline-none"}
                        onClick={() => handleDelta("dimensions", -1)}>
                        <svg
                            class="size-3 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2">
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 1h16"
                            />
                        </svg>
                    </Button>
                    <input
                        class="w-full"
                        type="number"
                        name="dimensions"
                        value={props.dimensions}
                        onChange={() => props.updateFields}
                        placeholder="Dimensions"
                        required
                    />
                    <Button
                        class={"h-12 border border-l-0 border-[#ffffff40] focus:outline-none"}
                        onClick={() => handleDelta("dimensions", +1)}>
                        <svg
                            class="size-3 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18">
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 1v16M1 9h16"
                            />
                        </svg>
                    </Button>
                </div>
                <select name="unitType" value={props.unitType} onChange={() => props.updateFields}>
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
