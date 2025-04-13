import type { JSX, ParentComponent } from "solid-js";

type Props = JSX.IntrinsicElements["a"] & {
    href: string;
    newTab?: boolean;
    class?: string;
};

// eslint-disable-next-line solid/no-destructure -- Safe since we dont need any reactivity
const Link: ParentComponent<Props> = ({ href, newTab, class: className = "", children, ...attrs }) => {
    return (
        <a
            href={href}
            target={newTab ? "_blank" : "_self"}
            rel={newTab ? "noopener noreferrer" : undefined}
            class={` ${className}`}
            {...attrs}>
            {children}
        </a>
    );
};

export default Link;
