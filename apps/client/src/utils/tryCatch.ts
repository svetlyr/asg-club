/* eslint-disable @typescript-eslint/unified-signatures */
type Success<T> = readonly [T, null];
type Failure<E> = readonly [null, E];
type ResultSync<T, E> = Success<T> | Failure<E>;
type ResultAsync<T, E> = Promise<ResultSync<T, E>>;
type Operation<T> = Promise<T> | (() => T) | (() => Promise<T>);

function tryCatch<T, E = Error>(operation: Promise<T>): ResultAsync<T, E>;
function tryCatch<T, E = Error>(operation: () => Promise<T>): ResultAsync<T, E>;
function tryCatch<T, E = Error>(operation: () => T): ResultSync<T, E>;
function tryCatch<T, E = Error>(operation: Operation<T>): ResultSync<T, E> | ResultAsync<T, E> {
    if (operation instanceof Promise) {
        return operation
            .then((data: T) => [data, null] as const)
            .catch((error: unknown) => [null, error as E] as const);
    }

    try {
        const result = operation();

        if (result instanceof Promise) {
            return result
                .then((data: T) => [data, null] as const)
                .catch((error: unknown) => [null, error as E] as const);
        }

        return [result, null] as const;
    } catch (error) {
        return [null, error as E] as const;
    }
}

export { tryCatch };
