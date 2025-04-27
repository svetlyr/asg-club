/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { JSX, ParentComponent } from "solid-js";

type BaseLinkProps = JSX.IntrinsicElements["a"];
interface Props extends BaseLinkProps {
    href: string;
    newTab?: boolean;
    class?: string;
}

// eslint-disable-next-line solid/no-destructure
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
