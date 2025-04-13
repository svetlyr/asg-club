import type { JSX, ParentComponent } from "solid-js";
import { twMerge as tw } from "tailwind-merge";

type Props = JSX.IntrinsicElements["button"] & {
    class?: string;
    onClick?: () => void;
};

// eslint-disable-next-line solid/no-destructure
const Button: ParentComponent<Props> = ({ onClick, class: className = "", children, ...attrs }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            class={tw(`px-4 py-2 font-poppins font-semibold text-white ${className}`)}
            {...attrs}>
            {children}
        </button>
    );
};

export default Button;
