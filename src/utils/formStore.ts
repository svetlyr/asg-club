import { atom } from "nanostores";
import type { OrderSchema } from "@schemas/formSchema";
import { setValue, type FormStore } from "@modular-forms/solid";

export const $formValue = atom<FormStore<OrderSchema> | null>(null);

export function changeFormValue(serviceTypeValue: string): void {
    const formValue = $formValue.get();
    if (formValue) setValue(formValue, "serviceType", serviceTypeValue);
}
