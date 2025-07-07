import type { VoidComponent, VoidProps } from "solid-js";
import UnitTypeField from "./UnitTypeField";
import type { unitTypes } from "@schemas/formSchema";

export type WithUnitComponent<P extends VoidProps = object> = VoidComponent<P> & {
    readonly __withUnit: true;
};
function withUnit<P extends VoidProps>(
    ValueComponent: VoidComponent<P>,
    fieldKey: keyof typeof unitTypes,
): WithUnitComponent<P> {
    const Wrapped: VoidComponent<P> & { __withUnit: true } = (props) => {
        return (
            <div class="flex gap-x-4">
                <ValueComponent {...props} />

                <UnitTypeField fieldKey={fieldKey} />
            </div>
        );
    };

    Wrapped.__withUnit = true;
    return Wrapped;
}

export default withUnit;
