import { createSignal, onMount, onCleanup, type Accessor } from "solid-js";

const createIsMobile = (breakpoint = 767): Accessor<boolean> => {
    const query = `(max-width: ${breakpoint}px)`;
    const [isMobile, setIsMobile] = createSignal<boolean>(false);

    onMount(() => {
        const mql: MediaQueryList = window.matchMedia(query);
        setIsMobile(mql.matches);

        const updateIsMobile = ({ matches }: MediaQueryListEvent): void => {
            setIsMobile(matches);
        };

        mql.addEventListener("change", updateIsMobile);
        onCleanup(() => mql.removeEventListener("change", updateIsMobile));
    });

    return isMobile;
};

export default createIsMobile;
