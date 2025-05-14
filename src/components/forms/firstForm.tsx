import type { Component } from "solid-js";
import type { BasicDetailsSchema } from "@utils/schema";
import SimpleLineIconsPhone from "@icons/sli/phone";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface FirstFormProps extends BasicDetailsSchema {
    updateFields: (
        event: Event & {
            currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            target: Element;
        },
    ) => void;
}

const FirstForm: Component<FirstFormProps> = ({ email, fullname, tel, updateFields }) => {
    return (
        <>
            <input type="email" value={email} onChange={updateFields} name="email" placeholder="Email" required />
            <input
                type="text"
                value={fullname}
                onChange={updateFields}
                name="fullname"
                placeholder="Full Name"
                pattern="^[A-Za-zА-Яа-я]{2,}(?:\s+[A-Za-zА-Яа-я]{2,})+$"
                required
            />
            <div class="flex items-center border border-[#ffffff40]">
                <SimpleLineIconsPhone class="ml-3 text-gray-primary" />
                <input
                    class="flex-1 border-none"
                    type="tel"
                    value={tel}
                    onChange={updateFields}
                    name="tel"
                    placeholder="123-456-7890 (Optional)"
                />
            </div>
        </>
    );
};

export default FirstForm;
