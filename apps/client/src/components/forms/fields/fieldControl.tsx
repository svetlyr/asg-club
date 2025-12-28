import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { JSX, ValidComponent } from "solid-js";

type Field = {
    error?: unknown;
    dirty?: boolean;
    value: string | undefined;
};

type Props<C> = {
    as?: C;
    field: Field;
    fieldProps: object;
    classList?: JSX.HTMLAttributes<HTMLElement>["classList"];
} & Record<string, unknown>;

/*
 * Wrapper component for cleaning up field props and adding validation state
 */
export const FieldControl = <C extends ValidComponent>(props: Props<C>): JSX.Element => {
    const [{ as = "input", field, classList, fieldProps }, rest] = splitProps(props, [
        "as",
        "field",
        "classList",
        "fieldProps",
    ]);

    return (
        <Dynamic
            component={as}
            value={field.value}
            {...fieldProps}
            {...rest}
            classList={{
                ...(classList ?? {}),
                "border-red-500": !!field.error,
                "border-green-500": field.dirty && !field.error,
            }}
        />
    );
};
