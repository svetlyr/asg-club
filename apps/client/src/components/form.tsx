import { Dynamic } from "solid-js/web";
import { Show, type Component } from "solid-js";
import { initFormStore } from "@stores/formStore";
import { valiForm, type SubmitHandler } from "@modular-forms/solid";
import {
    basicDetailsSchema,
    getServiceDetailsSchema,
    orderDefaults,
    orderSchema,
    type OrderSchema,
} from "@schemas/formSchema";

import Button from "./button";
import Stepper from "./stepper";
import CommentsForm from "./forms/commentsForm";
import BasicDetailsForm from "./forms/basicDetailsForm";
import ServiceDetailsForm from "./forms/serviceDetailsForm";

import ArrowLeft from "@icons/sli/arrow-left";
import ArrowRight from "@icons/sli/arrow-right";

import useMultiStepForm from "@hooks/useMultiStepForm";

import bike2 from "@assets/images/bike2.webp";
import bike3 from "@assets/images/bike3.webp";
import coffe2 from "@assets/images/coffee2.webp";

import "@styles/form.scss";

const STEPS_DATA = [
    {
        title: "Order",
        paragraph:
            "Don't wait. Just fill the form below with your desires related to our services and we'll do our best to make your wishes come true. Please fill in all requested fields for best results.",
        image: coffe2.src,
    },
    {
        title: "Details",
        paragraph:
            "We need some important information to understand the basics of your order and have a better idea of what you want.",
        image: bike2.src,
    },
    {
        title: "Almost Done",
        paragraph: "Comments",
        image: bike3.src,
    },
];

type Props = {
    wrapperClass?: string;
};

// eslint-disable-next-line solid/no-destructure
const MainForm: Component<Props> = ({ wrapperClass = "" }) => {
    const { Form } = initFormStore({
        initialValues: orderDefaults,
        validateOn: "submit",
        revalidateOn: "input",
        validate: (value) => {
            switch (currentStepIndex()) {
                case 0:
                    return valiForm(basicDetailsSchema)(value);
                case 1: {
                    // * cant be undefined since we set initialValues
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const serviceSchema = getServiceDetailsSchema(value.serviceType!);

                    return valiForm(serviceSchema)(value);
                }
                case 2:
                    return valiForm(orderSchema)(value);
                default:
                    return (): void => {};
            }
        },
    });

    const { isFirstStep, isLastStep, next, back, currentStep, currentStepIndex } = useMultiStepForm([
        BasicDetailsForm,
        ServiceDetailsForm,
        CommentsForm,
    ]);

    const handleSubmit: SubmitHandler<OrderSchema> = (_e): void => {
        if (!isLastStep()) next();

        return;
    };

    return (
        <div id="form" class={`flex items-start justify-center gap-x-16 py-32 ${wrapperClass}`}>
            <Form class="w-full lg:max-w-xl" onSubmit={handleSubmit}>
                <h2 class="mb-6 text-center text-5xl lg:text-left">{STEPS_DATA[currentStepIndex()].title}</h2>
                <p class="mb-20 text-center lg:text-left">{STEPS_DATA[currentStepIndex()].paragraph}</p>
                <Stepper currentStep={currentStepIndex} />

                <div class="space-y-4">
                    <Dynamic component={currentStep()} />
                </div>

                <div class="mt-4 flex gap-x-5">
                    <Show when={!isFirstStep()}>
                        <Button
                            onClick={back}
                            class="flex w-full items-center justify-center gap-x-1 bg-red-primary px-6 py-3 font-bold lg:w-fit">
                            <ArrowLeft /> PREV
                        </Button>
                    </Show>
                    <Button
                        type="submit"
                        class="flex w-full items-center justify-center gap-x-1 bg-red-primary px-6 py-3 font-bold lg:w-fit">
                        {isLastStep() ? "SEND ORDER" : "NEXT"} <ArrowRight />
                    </Button>
                </div>
            </Form>
            <img
                width={522}
                class="hidden pr-4 lg:block"
                src={STEPS_DATA[currentStepIndex()].image}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
};

export default MainForm;
