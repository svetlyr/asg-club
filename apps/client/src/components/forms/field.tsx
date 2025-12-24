/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, type FieldComponentProps } from "@stores/formStore";
import type { FieldElementProps, FieldStore, FieldPathValue } from "@modular-forms/solid";
import type { JSX } from "solid-js";

// * extract render function type
type RenderOf<T> = T extends (...a: infer A) => infer R ? (...a: A) => R : never;
type RenderFn = RenderOf<NonNullable<FieldComponentProps["children"]>>;

// * extract base form types
type AnyField = Parameters<RenderFn>[0];
type Values = AnyField extends FieldStore<infer V, any> ? V : never;
type Names = AnyField extends FieldStore<any, infer N> ? N : never;

// * map schema value -> your "type" prop
type KindOf<V> = [V] extends [File[]] ? "File[]" : [V] extends [number] ? "number" : "string";

type FieldType<N extends Names> = KindOf<NonNullable<FieldPathValue<Values, N>>>;

type Bind<N extends Names> = FieldElementProps<Values, N> & {
    value: FieldPathValue<Values, N>;
    classList: Record<string, boolean>;
};

type Props<N extends Names> = Omit<FieldComponentProps, "children" | "name" | "type" | "keepActive"> & {
    name: N;
    type: FieldType<N>;
    keepActive?: boolean;
    children: (bind: Bind<N>, field: FieldStore<Values, N>) => JSX.Element;
};

export const FormField = <N extends Names>(p: Props<N>): JSX.Element => {
    const { Field } = useForm();

    const { children, keepActive, ...fieldProps } = p;

    return (
        <Field {...fieldProps} keepActive={keepActive ?? true}>
            {(field, elProps) => {
                const bind = {
                    ...elProps,
                    value: field.value,
                    classList: {
                        "border-red-500": !!field.error,
                        "border-green-500": field.dirty && !field.error,
                    },
                } satisfies Bind<N>;

                return children(bind, field);
            }}
        </Field>
    );
};
