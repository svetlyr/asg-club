/**
 * * Type helper that recursively filters keys from a tuple.
 * @template T The tuple to filter.
 * @template U The union of types to exclude.
 */
export type TupleExclude<T extends readonly unknown[], U> = T extends readonly [infer Head, ...infer Tail]
    ? Head extends U
        ? TupleExclude<Tail, U>
        : readonly [Head, ...TupleExclude<Tail, U>]
    : readonly [];

export type StrictNonNullable<T> = {
    [K in keyof T]-?: NonNullable<T[K]>;
};
