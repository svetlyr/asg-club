import { Dynamic } from "solid-js/web";
import { createEffect, createMemo, on, Show, type Component } from "solid-js";
import { getErrors, reset, valiForm, type SubmitHandler } from "@modular-forms/solid";

import {
    orderSchema,
    type OrderSchema,
    orderDefaults,
    basicDetailsSchema,
    getServiceDetailsSchema,
} from "@schemas/formSchema";
import Button from "./button";
import Stepper from "./stepper";
import ToastContainer from "./toastContainer";
import { showToast } from "@stores/toastStore";
import { initFormStore } from "@stores/formStore";
import useMultiStepForm from "@hooks/useMultiStepForm";

import CommentsForm from "./forms/commentsForm";
import BasicDetailsForm from "./forms/basicDetailsForm";
import ServiceDetailsForm from "./forms/serviceDetailsForm";

import ArrowLeft from "@icons/sli/arrow-left";
import ArrowRight from "@icons/sli/arrow-right";

import bike2 from "@assets/images/bike2.webp";
import bike3 from "@assets/images/bike3.webp";
import coffe2 from "@assets/images/coffee2.webp";

import "@styles/form.scss";

const STEPS_DATA = [
    {
        title: "Order",
        stepperTitle: "Order Details",
        paragraph:
            "Don't wait. Just fill the form below with your desires related to our services and we'll do our best to make your wishes come true. Please fill in all requested fields for best results.",
        image: coffe2.src,
    },
    {
        title: "Details",
        stepperTitle: "Service Details",
        paragraph:
            "We need some important information to understand the basics of your order and have a better idea of what you want.",
        image: bike2.src,
    },
    {
        title: "Almost Done",
        stepperTitle: "Comments",
        image: bike3.src,
    },
];

type Props = {
    wrapperClass?: string;
};

// eslint-disable-next-line solid/no-destructure
const MainForm: Component<Props> = ({ wrapperClass = "" }) => {
    const { form, Form } = initFormStore({
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

                    console.log(value.url);
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

    createEffect(
        on(
            [() => form.submitCount, () => form.invalid],

            ([submitCount, invalid]) => {
                if (submitCount && invalid) {
                    const errors = getErrors(form);

                    Object.values(errors)
                        .filter((msg): msg is string => Boolean(msg))
                        .forEach((msg, i) => setTimeout(() => showToast(msg), 500 * i));
                }
            },
            { defer: true },
        ),
    );

    const handleSubmit: SubmitHandler<OrderSchema> = (e): void => {
        console.log("Form submitted with values:", e);

        if (!isLastStep()) handleNavigation(next);

        return;
    };

    // ? find another way to reset form submit count
    const handleNavigation = (navigate: () => void): void => {
        // * this is stupid
        reset(form, { keepValues: true });
        navigate();
    };

    const step = createMemo(() => STEPS_DATA[currentStepIndex()]);
    return (
        <>
            <ToastContainer />
            <div id="form" class={`flex items-start justify-center gap-x-16 py-32 ${wrapperClass}`}>
                <Form class="w-full lg:max-w-xl" onSubmit={handleSubmit}>
                    <h2 class="mb-6 text-center text-5xl lg:text-left">{step().title}</h2>
                    <p class="mb-20 text-center lg:text-left">{step().paragraph}</p>
                    <Stepper currentStep={currentStepIndex} steps={STEPS_DATA} />

                    <div class="space-y-4">
                        <Dynamic component={currentStep()} />
                    </div>

                    <div class="mt-4 flex gap-x-5">
                        <Show when={!isFirstStep()}>
                            <Button
                                onClick={() => handleNavigation(back)}
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
                <img width={522} class="hidden pr-4 lg:block" src={step().image} loading="lazy" decoding="async" />
            </div>
        </>
    );
};

export default MainForm;
