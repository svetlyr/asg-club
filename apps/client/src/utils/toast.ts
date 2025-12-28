import { toast } from "@stores/toastStore";

export const toastsWithDelay = (getErrors: () => Record<string, string | undefined>, delay = 300): void => {
    console.log("errors", getErrors());

    requestAnimationFrame(() => {
        const errors = getErrors();

        const messages = Object.values(errors).filter(Boolean);

        messages.forEach((msg, i) => setTimeout(() => toast.info(msg), delay * i));
    });
};
