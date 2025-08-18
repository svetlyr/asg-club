import { Portal } from "solid-js/web";
import Panzoom, { type PanzoomObject } from "@panzoom/panzoom";
import { createSignal, createEffect, onCleanup, Show, type VoidComponent } from "solid-js";

type PreviewData = {
    src: string;
    alt: string;
};

type Props = {
    gridClass: string;
    gridItemClass: string;
};

// eslint-disable-next-line solid/no-destructure
const ImagePreview: VoidComponent<Props> = ({ gridClass, gridItemClass }) => {
    let imgRef!: HTMLImageElement;
    const [preview, setPreview] = createSignal<PreviewData | null>(null);

    const handleClose = () => void setPreview(null);

    const handleClick = ({ target }: Event): void => {
        if (!(target instanceof Element)) return;

        const trigger = target.closest(`.${gridItemClass}`);

        if (!(trigger instanceof HTMLElement)) return;

        const { dataset } = trigger;

        setPreview({
            alt: dataset.alt ?? "",
            src: dataset.src ?? "",
        });
    };

    const handleKeyDown = ({ key }: KeyboardEvent): void => {
        if (key === "Escape") setPreview(null);
    };

    createEffect(() => {
        const grid = document.querySelector(`.${gridClass}`);
        if (!grid) return;

        grid.addEventListener("click", handleClick);

        onCleanup(() => grid.removeEventListener("click", handleClick));
    });

    createEffect(() => {
        // * prevent page scroll when preview is open
        document.body.style.overflow = preview() ? "hidden" : "";

        onCleanup(() => (document.body.style.overflow = ""));
    });

    createEffect(() => {
        if (preview()) {
            const panzoom = Panzoom(imgRef, {
                contain: "outside",
            });

            const parent = imgRef.parentElement;
            if (!parent) return;

            document.addEventListener("keydown", handleKeyDown);
            // parent.addEventListener("click", panzoom.zoomIn);
            parent.addEventListener("wheel", panzoom.zoomWithWheel);

            onCleanup(() => {
                panzoom.destroy();
                document.removeEventListener("keydown", handleKeyDown);
                parent.removeEventListener("wheel", panzoom.zoomWithWheel);
                // parent.removeEventListener("click", panzoom.zoomIn);
            });
        }
    });

    return (
        <Show when={preview()}>
            {(data) => (
                <Portal>
                    <div
                        class="fixed inset-0 z-20 flex items-center justify-center bg-black-primary/60"
                        onClick={handleClose}>
                        <div
                            class="relative max-w-[95vw] overflow-hidden rounded-lg bg-black-tertiary shadow-2xl"
                            onClick={(e) => e.stopPropagation()}>
                            <img class="block" src={data().src} alt={data().alt} ref={imgRef} />
                            <button
                                class="text-gradient absolute right-2 top-1 text-3xl font-bold"
                                onClick={handleClose}>
                                &times;
                            </button>
                        </div>
                    </div>
                </Portal>
            )}
        </Show>
    );
};

export default ImagePreview;
