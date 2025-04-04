import { createSignal, onMount, onCleanup, type Accessor } from "solid-js";

const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

const createIsMobile = (breakpoint: BreakpointKey = "md"): Accessor<boolean> => {
    const [isMobile, setIsMobile] = createSignal<boolean>(false);

    onMount(() => {
        const minWidth = BREAKPOINTS[breakpoint];
        const mql = window.matchMedia(`(min-width: ${minWidth}px)`);

        const update = ({ matches }: MediaQueryListEvent): void => {
            setIsMobile(!matches);
        };

        setIsMobile(!mql.matches);

        mql.addEventListener("change", update);
        onCleanup(() => mql.removeEventListener("change", update));
    });

    return isMobile;
};

export default createIsMobile;
