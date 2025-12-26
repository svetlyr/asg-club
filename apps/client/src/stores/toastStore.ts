import { createSignal, type Accessor } from "solid-js";

export type Toast = {
    id: string;
    message: string;
    leaving: boolean;
};

const [toasts, setToasts] = createSignal<Toast[]>([]);

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function showToast(message: string, timeout = 5000): void {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, leaving: false }]);
    setTimeout(() => beginRemoveToast(id), timeout);
}

function beginRemoveToast(id: string): void {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
}

function finalizeRemoveToast(id: string): void {
    setToasts((prev) => prev.filter((t) => t.id !== id));
}

function useToasts(): Accessor<Toast[]> {
    return toasts;
}

export const toast = {
    info: (message: string, timeout = 5000): void => showToast(message, timeout),
};

export const handleErrorToasts = (errors: string | string[] | undefined, delay = 300): void => {
    const messages = Array.isArray(errors) ? errors : [errors];
    const msgs = messages.filter(Boolean);

    requestAnimationFrame(() => {
        msgs.forEach((msg, i) => setTimeout(() => toast.info(msg), delay * i));
    });
};

export { showToast, beginRemoveToast, finalizeRemoveToast, useToasts };
