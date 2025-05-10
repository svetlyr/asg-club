type ClickHandler<T extends Element> = (e: MouseEvent & { currentTarget: T }) => void;

export function addOnClick<T extends Element = Element>(element: T | null, handler: ClickHandler<T>): void {
    if (!element) return;

    element.addEventListener("click", (e) => handler(e as MouseEvent & { currentTarget: T }));
}
