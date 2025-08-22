export function concatTuples<A extends readonly unknown[], B extends readonly unknown[]>(a: A, b: B): [...A, ...B] {
    return [...a, ...b] as [...A, ...B];
}
