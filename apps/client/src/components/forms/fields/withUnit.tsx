import type { VoidComponent, VoidProps } from "solid-js";
import UnitTypeField from "./UnitTypeField";

export type WithUnitComponent<P extends VoidProps = object> = VoidComponent<P> & {
    readonly __withUnit: true;
};
function withUnit<P extends VoidProps>(ValueComponent: VoidComponent<P>): WithUnitComponent<P> {
    const Wrapped: VoidComponent<P> & { __withUnit: true } = (props) => {
        return (
            <div class="flex gap-x-4">
                <ValueComponent {...props} />

                <UnitTypeField />
            </div>
        );
    };

    Wrapped.__withUnit = true;
    return Wrapped;
}

export default withUnit;
