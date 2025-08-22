import { createEffect, type Accessor } from "solid-js";

// * First Last Invert Play pattern
export default function useFlip(elements: Accessor<Record<string, HTMLElement>>): void {
    let prevRects = new Map<string, DOMRect>();

    createEffect(() => {
        const elems = elements();

        requestAnimationFrame(() => {
            const newRects = new Map<string, DOMRect>();

            for (const [id, el] of Object.entries(elems)) {
                const rect = el.getBoundingClientRect();
                newRects.set(id, rect);

                const prev = prevRects.get(id);
                if (!prev) continue;

                const deltaY = prev.top - rect.top;
                if (!deltaY) continue;

                el.animate([{ transform: `translateY(${deltaY}px)` }, { transform: "translateY(0)" }], {
                    duration: 300,
                    easing: "ease",
                });
            }

            prevRects = newRects;
        });
    });
}
