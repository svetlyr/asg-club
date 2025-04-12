declare module "@icons/*" {
    import type { ComponentProps, JSX } from "solid-js";

    const component: (props: ComponentProps<"svg">) => JSX.Element;
    export default component;
}

declare module "@icons" {
    import type { ComponentProps, JSX } from "solid-js";
    export type IconType = (props: ComponentProps<"svg">) => JSX.Element;
}
