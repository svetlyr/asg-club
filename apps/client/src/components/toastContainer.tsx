import { Portal } from "solid-js/web";
import { For, createSignal, onCleanup, type VoidComponent } from "solid-js";

import useFlip from "@hooks/useFLIP";
import { useToasts, beginRemoveToast, finalizeRemoveToast, type Toast } from "@stores/toastStore";

import "@styles/toast.scss";

const ToastContainer: VoidComponent = () => {
    const toasts = useToasts();
    const [refs, setRefs] = createSignal<Record<string, HTMLElement>>({});

    useFlip(refs);

    return (
        <Portal>
            <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
                <For each={toasts()}>
                    {(t: Toast) => {
                        onCleanup(() => setRefs(({ [t.id]: _, ...refs }) => refs));

                        return (
                            <div
                                ref={(el) => setRefs((prev) => ({ ...prev, [t.id]: el }))}
                                class="flex items-center justify-between rounded-md border border-gray-700 bg-black-quaternary px-4 py-3 text-white shadow-lg"
                                classList={{
                                    "toast-enter": !t.leaving,
                                    "toast-exit": t.leaving,
                                }}
                                onAnimationEnd={({ animationName }) => {
                                    if (animationName === "toast-out") {
                                        finalizeRemoveToast(t.id);
                                    }
                                }}>
                                <span>{t.message}</span>
                                <button
                                    aria-label="Dismiss"
                                    class="ml-4 cursor-pointer border-0 bg-transparent font-bold text-current"
                                    onClick={() => beginRemoveToast(t.id)}>
                                    ×
                                </button>
                            </div>
                        );
                    }}
                </For>
            </div>
        </Portal>
    );
};

export default ToastContainer;
