import "@styles/form.scss";

import { Show, type Component } from "solid-js";
import { createFormStore, Form, valiForm, type SubmitHandler } from "@modular-forms/solid";
import { basicDetailsSchema, orderSchema, serviceDetailsSchema, type OrderSchema } from "@schemas/formSchema";

import Stepper from "./stepper";
import CommentsForm from "./forms/commentsForm";
import BasicDetailsForm from "./forms/basicDetailsForm";
import ServiceDetailsForm from "./forms/serviceDetailsForm";

import ArrowLeft from "@icons/sli/arrow-left";
import ArrowRight from "@icons/sli/arrow-right";

import useMultiStepForm from "@hooks/useMultiStepForm";

const STEPS_DATA = [
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

const MainForm: Component = () => {
    const formData = createFormStore<OrderSchema>({
        validateOn: "input",
        validate: () => {
            switch (currentStepIndex()) {
                case 0:
                    return valiForm(basicDetailsSchema);
                case 1:
                    return valiForm(serviceDetailsSchema);
                case 2:
                    return valiForm(orderSchema);
                default:
                    return {};
            }
        },
    });

    const { isFirstStep, isLastStep, next, back, step, currentStepIndex } = useMultiStepForm([
        <BasicDetailsForm form={formData} />,
        <ServiceDetailsForm form={formData} />,
        <CommentsForm form={formData} />,
    ]);

    const handleSubmit: SubmitHandler<OrderSchema> = (): void => {
        if (!isLastStep()) next();
        return;
    };

    return (
        <div class="my-32 flex items-start justify-center gap-x-16">
            <Form of={formData} class="w-full lg:max-w-xl" onSubmit={handleSubmit}>
                <h2 class="mb-6 text-center text-5xl lg:text-left">{STEPS_DATA[currentStepIndex()]?.title}</h2>
                <p class="mb-20 text-center lg:text-left">{STEPS_DATA[currentStepIndex()]?.paragraph}</p>
                <Stepper currentStep={currentStepIndex} />
                <div class="space-y-4">{step()}</div>
                <div class="mt-4 flex gap-x-5">
                    <Show when={!isFirstStep()}>
                        <button
                            onClick={back}
                            type="button"
                            class="flex w-full items-center justify-center gap-x-1 bg-red-primary px-6 py-3 font-bold lg:w-fit">
                            <ArrowLeft /> PREV
                        </button>
                    </Show>
                    <button
                        type="submit"
                        class="flex w-full items-center justify-center gap-x-1 bg-red-primary px-6 py-3 font-bold lg:w-fit">
                        {isLastStep() ? "SEND ORDER" : "NEXT"} <ArrowRight />
                    </button>
                </div>
            </Form>
            <img
                width={522}
                class="hidden pr-4 lg:block"
                src={`src/assets/images/${STEPS_DATA[currentStepIndex()]?.imageName}.webp`}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
};

export default MainForm;
