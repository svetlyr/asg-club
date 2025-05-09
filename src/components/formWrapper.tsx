import { type ParentComponent } from "solid-js";

interface FormWrapperProps {
    title: string;
    paragraph: string;
    imageName: "coffee2" | "bike2" | "bike3";
}

const FormWrapper: ParentComponent<FormWrapperProps> = ({ title, paragraph, imageName, children }) => {
    return (
        <div class="flex max-w-[1170px] ">
            <div>
                <h2 class="mb-6 text-5xl font-semibold text-white">{title}</h2>
                <p class="mb-20 text-gray-primary">{paragraph}</p>
                <div class="grid gap-y-4">{children}</div>
            </div>
            <img class="max-h-[575px]" src={`images/${imageName}.jpg`} />
        </div>
    );
};

export default FormWrapper;
