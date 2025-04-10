import type { JSX, ParentComponent } from "solid-js";

type Props = JSX.IntrinsicElements["button"] & {
    class?: string;
    onClick?: () => void;
};

// eslint-disable-next-line solid/no-destructure
const Button: ParentComponent<Props> = ({ onClick, class: className = "", children, ...attrs }) => {
    return (
        <button type="button" class={`font-poppins font-semibold text-white ${className}`} onClick={onClick} {...attrs}>
            {children}
        </button>
    );
};

export default Button;
