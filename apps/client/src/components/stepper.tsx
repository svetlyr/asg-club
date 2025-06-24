import { For, type Component } from "solid-js";

const steps = ["Basic Details", "Service Details", "Comments"];

type StepperProps = {
    currentStep: () => number;
};

const Stepper: Component<StepperProps> = (props) => {
    return (
        <div class="mb-6 overflow-hidden bg-black">
            <div class="flex items-center justify-around">
                <For each={steps}>
                    {(item, index) => {
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
                                <span class="mt-2 text-sm font-medium text-white sm:text-base">{item}</span>
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};

export default Stepper;
