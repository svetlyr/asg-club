import { For, type Component } from "solid-js";

type StepperProps = {
    currentStep: () => number;
    steps: { stepperTitle: string; [key: PropertyKey]: unknown }[];
};

export const Stepper: Component<StepperProps> = (props) => {
    return (
        <div class="mb-6 overflow-hidden">
            <div class="flex items-center justify-around">
                <For each={props.steps}>
                    {({ stepperTitle }, index) => {
                        return (
                            <div
                                class={"flex w-full flex-col items-center"}
                                classList={{
                                    "stepper-item": props.currentStep() < index(),
                                    "stepper-item__active": props.currentStep() === index(),
                                    "stepper-item__completed": props.currentStep() > index(),
                                }}>
                                <div
                                    class={
                                        "z-10 flex size-10 items-center justify-center rounded-full border-2 border-none"
                                    }
                                    classList={{
                                        "stepper-item--label": props.currentStep() < index(),
                                        "stepper-item--label__filled": props.currentStep() >= index(),
                                    }}>
                                    <span class="z-10 text-lg font-semibold text-white">{index() + 1}</span>
                                </div>
                                <span class="mt-2 text-sm font-medium text-white sm:text-base">{stepperTitle}</span>
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};
