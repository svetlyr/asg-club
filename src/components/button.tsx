/* eslint-disable @typescript-eslint/consistent-type-definitions */
import tw from "@utils/tw";
import type { JSX, ParentComponent } from "solid-js";

type BaseButtonProps = JSX.IntrinsicElements["button"];
interface Props extends BaseButtonProps {
    class?: string;
    onClick?: () => void;
}

// eslint-disable-next-line solid/no-destructure
const Button: ParentComponent<Props> = ({ onClick, class: className = "", children, ...attrs }) => {
    return (
        <button type="button" onClick={onClick} class={tw(`px-4 py-2 font-semibold ${className}`)} {...attrs}>
            {children}
        </button>
    );
};

export default Button;
