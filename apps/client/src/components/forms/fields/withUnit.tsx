import type { VoidComponent, VoidProps } from "solid-js";

import { type UnitTypeKey } from "@constants";
import { UnitTypeField } from "./UnitTypeField";

export type WithUnitComponent<P extends VoidProps = object> = VoidComponent<P> & {
    readonly __withUnit: true;
};
export function withUnit<P extends VoidProps>(
    ValueComponent: VoidComponent<P>,
    fieldKey: UnitTypeKey,
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
