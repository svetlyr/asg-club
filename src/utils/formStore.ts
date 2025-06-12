import { atom } from "nanostores";
import { setValue, type FormStore } from "@modular-forms/solid";
import type { OrderSchema, ServiceType } from "@schemas/formSchema";

export const $formValue = atom<FormStore<OrderSchema> | null>(null);

export function changeFormValue(serviceTypeValue: ServiceType): void {
    const formValue = $formValue.get();
    if (formValue) setValue(formValue, "serviceType", serviceTypeValue);
}
