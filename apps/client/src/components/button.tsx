/* eslint-disable solid/components-return-once */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { JSX, ParentComponent } from "solid-js";

import { Link } from "./link";
import { tw } from "@utils/tw";
import { type LinkProps } from "./link";

interface LinkOnlyProps extends LinkProps {
    type?: never;
    onClick?: never;
}

type BaseButtonProps = JSX.IntrinsicElements["button"];
interface ButtonOnlyProps extends BaseButtonProps {
    type?: "button" | "submit" | "reset" | "menu";
    href?: never;
}

type Props = { animated?: boolean } & (ButtonOnlyProps | LinkOnlyProps);

// eslint-disable-next-line solid/no-destructure
export const Button: ParentComponent<Props> = ({
    href,
    type,
    onClick,
    animated,
    children,
    class: className = "",
    ...attrs
}) => {
    const classes = tw([
        className,
        "px-4 py-2 font-semibold text-white",
        animated ? "btn-bg-animate bg-transparent text-white border-gradient" : "",
    ]);

    if (href) {
        return (
            <Link href={href} class={classes} {...(attrs as Omit<LinkProps, "href">)}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type ?? "button"} onClick={onClick} class={classes} {...(attrs as BaseButtonProps)}>
            {children}
        </button>
    );
};
