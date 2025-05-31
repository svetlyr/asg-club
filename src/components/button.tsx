/* eslint-disable solid/components-return-once */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { JSX, ParentComponent } from "solid-js";

import Link from "./link";
import tw from "@utils/tw";
import type { LinkProps } from "./link";

type BaseButtonProps = JSX.IntrinsicElements["button"];
interface ButtonOnlyProps extends BaseButtonProps {
    href?: never;
}

interface AnchorOnlyProps extends LinkProps {
    onClick?: never;
}

type Props = ButtonOnlyProps | AnchorOnlyProps;

// eslint-disable-next-line solid/no-destructure
const Button: ParentComponent<Props> = ({ href, onClick, class: className = "", children, ...attrs }) => {
    const classes = tw(`px-4 py-2 font-semibold ${className}`);

    if (href) {
        return (
            <Link href={href} class={classes} {...(attrs as Omit<LinkProps, "href">)}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} class={classes} {...(attrs as BaseButtonProps)}>
            {children}
        </button>
    );
};

export default Button;
