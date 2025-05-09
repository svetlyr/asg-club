import { createStore } from "solid-js/store";
import { Show, type Component, type JSX } from "solid-js";
import { useMultiStepForm } from "@utils/useMultiStepForm";
import type { OrderSchema } from "@utils/schema";

import FirstForm from "./firstForm";
import SecondForm from "./secondForm";
import ThirdForm from "./thirdForm";

import ArrowLeft from "@icons/simple-line-icons/arrow-left";
import ArrowRight from "@icons/simple-line-icons/arrow-right";

const defaultOrder: OrderSchema = {
    email: "",
    fullname: "",
    tel: "",
    serviceType: "Merch",
    description: "",
    quantity: 1,
    dimensions: 1,
    unitType: "cm",
    comments: "",
};

const Form: Component = () => {
    const [order, setOrder] = createStore<OrderSchema>(defaultOrder);

    const updateField: JSX.EventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, Event> = (
        event,
    ) => {
        const { name, value } = event.currentTarget;
        setOrder(name as keyof typeof order, value);
    };

    const { isFirstStep, isLastStep, next, back, step } = useMultiStepForm([
        <FirstForm {...order} updateFields={updateField} />,
        <SecondForm {...order} updateFields={updateField} />,
        <ThirdForm {...order} updateFields={updateField} />,
    ]);

    const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
        event.preventDefault();
        console.log("Form submitted:", order);
        if (!isLastStep()) return next();
    };

    return (
        <form onSubmit={handleSubmit} class="bg-black-primary py-24 font-poppins px-global md:pb-32 lg:pb-36">
            {step()}
            <div class="mt-4 flex gap-x-5 text-white">
                <Show when={!isFirstStep()}>
                    <button
                        onClick={back}
                        class="flex max-w-fit items-center gap-x-1 bg-red-primary px-6 py-3 font-bold">
                        <ArrowLeft /> PREV
                    </button>
                </Show>
                <button type="submit" class="flex max-w-fit items-center gap-x-1 bg-red-primary px-6 py-3 font-bold">
                    {isLastStep() ? "SEND ORDER" : "NEXT"} <ArrowRight />
                </button>
            </div>
        </form>
    );
};

export default Form;
