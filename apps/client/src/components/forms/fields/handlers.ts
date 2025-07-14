import type { JSX } from "solid-js";

export const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e): void => {
    // * allow clipboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        return;
    }

    if (e.key === "." && !e.currentTarget.value.includes(".")) {
        return;
    }

    // * discard input on non-digit
    if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
};

export function handlePaste(e: ClipboardEvent): void {
    const text = e.clipboardData?.getData("text").trim() ?? "";

    // * discard input on non-digit
    if (isNaN(parseFloat(text)) || !isFinite(Number(text)) || Number(text) < 0) {
        e.preventDefault();
    }
}
