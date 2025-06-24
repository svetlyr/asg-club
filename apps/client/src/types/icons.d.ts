declare module "@icons/*?raw" {
    const rawSvg: string;
    export default rawSvg;
}

declare module "@icons/*" {
    import type { ComponentProps, JSX } from "solid-js";

    const component: (props: ComponentProps<"svg">) => JSX.Element;
    export default component;
}

declare module "@icons" {
    import type { ComponentProps, JSX } from "solid-js";

    export type IconType =
        // * Solid
        | ((props: ComponentProps<"svg">) => JSX.Element)
        // * Astro
        | (((_props: astroHTML.JSX.SVGAttributes) => unknown) & ImageMetadata);
}
