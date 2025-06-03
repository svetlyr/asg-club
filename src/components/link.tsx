/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { JSX, ParentComponent } from "solid-js";

type BaseLinkProps = JSX.IntrinsicElements["a"];
export interface LinkProps extends BaseLinkProps {
    href: string;
    newTab?: boolean | undefined;
    class?: string;
}

// eslint-disable-next-line solid/no-destructure
const Link: ParentComponent<LinkProps> = ({ href, newTab, class: className = "", children, ...attrs }) => {
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
