import { atom } from "nanostores";

export const formValue = atom<string>("");

export function changeFormValue(): void {
    formValue.set("Balls");
}
