import { extendTailwindMerge } from "tailwind-merge";

export const tw = extendTailwindMerge({
    extend: {
        theme: {
            color: [
                "gray-primary",
                "red-primary",
                "orange-primary",
                "black-primary",
                "black-secondary",
                "black-tertiary",
                "black-quaternary",
            ],
        },
    },
});
