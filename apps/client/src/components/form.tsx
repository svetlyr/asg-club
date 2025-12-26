/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Dynamic } from "solid-js/web";
import { getErrors, reset, type SubmitHandler } from "@modular-forms/solid";
import { createEffect, createMemo, on, onMount, Show, type VoidComponent } from "solid-js";

import { Button } from "./button";
import { Stepper } from "./stepper";
import { serverApi } from "@api/client";
import { tryCatch } from "@utils/tryCatch";
import { buildFormData } from "@utils/form";
import { ToastContainer } from "./toastContainer";
import { makeFormValidator } from "@utils/validateForm";
import { setFormValue, useForm } from "@stores/formStore";
import { useMultiStepForm } from "@hooks/useMultiStepForm";
import { handleErrorToasts, toast } from "@stores/toastStore";
import { type OrderSchema, orderDefaults, type OrderKeys } from "@schemas/formSchema";

import CommentsForm from "./forms/commentsForm";
import BasicDetailsForm from "./forms/basicDetailsForm";
import ServiceDetailsForm from "./forms/serviceDetailsForm";
import { ArrowLeft, ArrowRight } from "@components/icons";

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

export const MainForm: VoidComponent = () => {
    let formRef!: HTMLFormElement;
    const { isFirstStep, isLastStep, next, back, currentStep, currentStepIndex, resetStep } = useMultiStepForm([
        BasicDetailsForm,
        ServiceDetailsForm,
        CommentsForm,
    ]);

    const { form, Form } = useForm({
        initialValues: orderDefaults,
        validateOn: "submit",
        revalidateOn: "input",
        validate: makeFormValidator(currentStepIndex),
    });

    createEffect(
        on(
            () => form.submitCount,
            () => handleErrorToasts(getErrors(form).files),
            { defer: true },
        ),
    );

    const handleSubmit: SubmitHandler<OrderSchema> = async (value): Promise<void> => {
        if (!isLastStep()) return next();

        console.log({ value });

        const formData = buildFormData(value);
        const [, error] = await tryCatch(serverApi.post("orders", formData));

        if (error) return toast.info("Failed to submit order. Please try again.");

        toast.info("Order submitted successfully!");

        reset(form);
        resetStep();
    };

    onMount(() => {
        const formData = new FormData(formRef);

        // TODO: save to session storage on unMount, clear on success
        for (const [key, value] of formData.entries()) {
            setFormValue(key as OrderKeys, value as string);
        }
    });

    const step = createMemo(() => STEPS_DATA[currentStepIndex()]);
    return (
        <>
            <div id="form" class="flex items-start justify-center gap-x-16 py-32">
                <Form class="w-full lg:max-w-xl" onSubmit={handleSubmit} ref={formRef}>
                    <h2 class="mb-6 text-center text-5xl lg:text-left">{step().title}</h2>
                    <p class="mb-20 text-center lg:mb-10 lg:text-left">{step().paragraph}</p>
                    <Stepper currentStep={currentStepIndex} steps={STEPS_DATA} />

                    <div class="space-y-4">
                        <Dynamic component={currentStep()} />
                    </div>

                    <div class="mt-4 flex gap-x-5">
                        <Show when={!isFirstStep()}>
                            <Button
                                onClick={() => back()}
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
            <ToastContainer />
        </>
    );
};
