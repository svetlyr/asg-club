import { createSignal, createMemo, type JSXElement } from "solid-js";

export function useMultiStepForm(steps: JSXElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = createSignal(0);

  const step       = createMemo(() => steps[currentStepIndex()]);
  const isFirst    = createMemo(() => currentStepIndex() === 0);
  const isLast     = createMemo(() => currentStepIndex() === steps.length - 1);

  function next() {
    setCurrentStepIndex(i => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setCurrentStepIndex(i => Math.max(i - 1, 0));
  }

  return {
    currentStepIndex,
    step,
    isFirstStep: isFirst,
    isLastStep : isLast,
    next,
    back,
  };
}