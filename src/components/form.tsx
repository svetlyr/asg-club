import { createStore } from "solid-js/store";
import { Show, type Component, type JSX } from "solid-js";
import { useMultiStepForm } from "@utils/useMultiStepForm";
import type { OrderSchema } from "@utils/schema";

import Stepper from "./stepper";
import FirstForm from "./forms/firstForm";
import SecondForm from "./forms/secondForm";
import ThirdForm from "./forms/thirdForm";

import ArrowLeft from "@icons/simple-line-icons/arrow-left";
import ArrowRight from "@icons/simple-line-icons/arrow-right";

type FormProps = {
    title: string;
    paragraph: string;
    imageName: "coffee2" | "bike2" | "bike3";
};

const STEPS_DATA: FormProps[] = [
    {
        title: "Order",
        paragraph:
            "Don't wait. Just fill the form below with your desires related to our services and we'll do our best to make your wishes come true. Please fill in all requested fields for best results.",
        imageName: "coffee2",
    },
    {
        title: "Details",
        paragraph:
            "We need some important information to understand the basics of your order and have a better idea of what you want.",
        imageName: "bike2",
    },
    {
        title: "Almost Done",
        paragraph: "Comments",
        imageName: "bike3",
    },
];

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
        // TODO: refactor without typecast
        setOrder(name as keyof typeof order, value);
    };

    const { isFirstStep, isLastStep, next, back, step, currentStepIndex } = useMultiStepForm([
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
        <div class="mx-auto flex justify-around">
            <form class="w-[555px]" onSubmit={handleSubmit}>
                <h2 class="mb-6 text-5xl">{STEPS_DATA[currentStepIndex()]?.title}</h2>
                <p class="mb-20">{STEPS_DATA[currentStepIndex()]?.paragraph}</p>
                <Stepper currentStep={currentStepIndex} />
                <div class="grid gap-y-4">{step()}</div>
                <div class="mt-4 flex gap-x-5">
                    <Show when={!isFirstStep()}>
                        <button
                            onClick={back}
                            type="button"
                            class="flex max-w-fit items-center gap-x-1 bg-red-primary px-6 py-3 font-bold">
                            <ArrowLeft /> PREV
                        </button>
                    </Show>
                    <button
                        type="submit"
                        class="flex max-w-fit items-center gap-x-1 bg-red-primary px-6 py-3 font-bold">
                        {isLastStep() ? "SEND ORDER" : "NEXT"} <ArrowRight />
                    </button>
                </div>
            </form>
            <img
                width={522}
                height={575}
                src={`src/assets/images/${STEPS_DATA[currentStepIndex()]?.imageName}.webp`}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
};

export default Form;
