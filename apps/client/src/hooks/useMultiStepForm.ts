import { createSignal, createMemo, type Accessor, type VoidComponent } from "solid-js";

type useMultiStepFormReturn = {
    currentIndex: Accessor<number>;
    currentStep: Accessor<VoidComponent>;
    isFirstStep: Accessor<boolean>;
    isLastStep: Accessor<boolean>;
    next: () => void;
    back: () => void;
    resetStep: () => void;
};

export function useMultiStepForm(steps: VoidComponent[]): useMultiStepFormReturn {
    const [index, setIndex] = createSignal(0);

    const step = createMemo(() => steps[index()]);
    const isFirst = createMemo(() => index() === 0);
    const isLast = createMemo(() => index() === steps.length - 1);

    function next(): void {
        setIndex((i) => Math.min(i + 1, steps.length - 1));
    }

    function back(): void {
        setIndex((i) => Math.max(i - 1, 0));
    }

    function reset(): void {
        setIndex(0);
    }

    return {
        currentIndex: index,
        currentStep: step,
        isFirstStep: isFirst,
        isLastStep: isLast,
        next,
        back,
        resetStep: reset,
    };
}
