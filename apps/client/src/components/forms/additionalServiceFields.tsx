import { Dynamic } from "solid-js/web";
import { createMemo, For } from "solid-js";
import { type VoidComponent } from "solid-js";

import { SizeField } from "./fields/SizeField";
import { useFormValue } from "@stores/formStore";
import { type MeasurementKey } from "@constants";
import { QuantityField } from "./fields/QuantityField";
import { DimensionsField } from "./fields/DimensionsField";
import { type WithUnitComponent } from "./fields/withUnit";
import { type UiSchemaFieldKey, uiSchemaFields } from "@schemas/uiSchemaField";

type FieldMapType = {
    [K in UiSchemaFieldKey]: K extends MeasurementKey ? WithUnitComponent : VoidComponent;
};

const fieldMap = {
    size: SizeField,
    quantity: QuantityField,
    dimensions: DimensionsField,
} satisfies FieldMapType;

export const AdditionalServiceFields: VoidComponent = () => {
    const serviceType = createMemo(() => useFormValue("serviceType"));

    return <For each={uiSchemaFields[serviceType()]}>{(fieldKey) => <Dynamic component={fieldMap[fieldKey]} />}</For>;
};
