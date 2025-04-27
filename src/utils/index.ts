import { extendTailwindMerge } from "tailwind-merge";

type Success<T> = [data: T, error: null];

type Failure<E> = [data: null, error: E];

type Result<T, E = Error> = Success<T> | Failure<E>;

export const tryCatch = async <T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> => {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error as E];
    }
};
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
