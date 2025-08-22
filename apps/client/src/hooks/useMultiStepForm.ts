import { createSignal, createMemo, type Accessor, type VoidComponent } from "solid-js";

type useMultiStepFormReturn = {
    currentStepIndex: Accessor<number>;
    currentStep: Accessor<VoidComponent>;
    isFirstStep: Accessor<boolean>;
    isLastStep: Accessor<boolean>;
    next: () => void;
    back: () => void;
    resetStep: () => void;
};

export default function useMultiStepForm(steps: VoidComponent[]): useMultiStepFormReturn {
    const [currentStepIndex, setCurrentStepIndex] = createSignal(0);

    const step = createMemo(() => steps[currentStepIndex()]);
    const isFirst = createMemo(() => currentStepIndex() === 0);
    const isLast = createMemo(() => currentStepIndex() === steps.length - 1);

    function next(): void {
        setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }

    function back(): void {
        setCurrentStepIndex((i) => Math.max(i - 1, 0));
    }

    function reset(): void {
        setCurrentStepIndex(0);
    }

    return {
        currentStepIndex,
        currentStep: step,
        isFirstStep: isFirst,
        isLastStep: isLast,
        next,
        back,
        resetStep: reset,
    };
}
