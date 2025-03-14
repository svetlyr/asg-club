import { createSignal, For, onCleanup, onMount } from "solid-js";
import type { Component } from "solid-js";

import Link from "./link";

import asgLogo from "@assets/asg-logo.svg";
import clubLogo from "@assets/club-logo.svg";
import Motorcycle from "@icons/fa6-solid/motorcycle";

const NAV_ITEMS = [
    { name: "Services", href: "/" },
    { name: "About Us", href: "/" },
    { name: "Contact Us", href: "/" },
];

type Props = {
    navCollapseId: string;
};

// eslint-disable-next-line solid/no-destructure
const Navbar: Component<Props> = ({ navCollapseId }) => {
    const navbarHeight = 84;
    const scrollThreshold = 200;
    const [isCollapsed, setIsCollapsed] = createSignal<boolean>(false);

    let lastScrollY = 0;
    let accumulatedScroll = 0;
    let ticking = false;
    let targetHidden = false;

    const updateAccumulatedScroll = (delta: number): void => {
        if (Math.sign(delta) !== Math.sign(accumulatedScroll)) {
            accumulatedScroll = 0;
        }
        accumulatedScroll += delta;
    };

    const handleScroll = (): void => {
        if (ticking || !targetHidden) return;

        ticking = true;
        window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const scrollUp = currentScrollY < lastScrollY;
            const delta = currentScrollY - lastScrollY;

            updateAccumulatedScroll(delta);

            const acc = Math.abs(accumulatedScroll);
            if (scrollUp && acc >= scrollThreshold) {
                setIsCollapsed(false);
                accumulatedScroll = 0;
            } else if (!scrollUp) {
                setIsCollapsed(true);
                accumulatedScroll = 0;
            }

            lastScrollY = currentScrollY;
            ticking = false;
        });
    };

    const observeTarget = ([entry]: IntersectionObserverEntry[]): void => {
        if (!entry) return;

        targetHidden = !entry.isIntersecting;
    };

    onMount(() => {
        lastScrollY = window.scrollY;
        window.addEventListener("scroll", handleScroll, { passive: true });

        let observer: IntersectionObserver;
        const target = document.getElementById(navCollapseId);
        if (target) {
            observer = new IntersectionObserver(observeTarget, {
                threshold: 1,
                rootMargin: `-${navbarHeight}px 0px 0px 0px`,
            });
            observer.observe(target);
        }

        onCleanup(() => {
            window.removeEventListener("scroll", handleScroll);
            if (observer) observer.disconnect();
        });
    });

    return (
        <header
            style={{ height: `${navbarHeight}px` }}
            classList={{ "-translate-y-full": isCollapsed(), "translate-y-0": !isCollapsed() }}
            class="sticky top-0 w-full bg-black-primary shadow-md transition-transform duration-300"
        >
            <div class="container mx-auto flex h-full items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
                <Link href="/" class="flex items-center">
                    <img src={asgLogo.src} alt="Logo" class="mr-2 size-12 sm:size-14 md:size-16" />
                    <img src={clubLogo.src} alt="Club text" class="size-12 sm:size-14 md:size-28" />
                </Link>

                <ul class="hidden items-center space-x-4 font-poppins text-white md:flex md:space-x-6 lg:space-x-8">
                    <For each={NAV_ITEMS}>
                        {({ name, href }) => (
                            <li>
                                <Link href={href} class="text-sm hover:text-gray-300 md:text-base lg:text-lg">
                                    {name}
                                </Link>
                            </li>
                        )}
                    </For>
                    <button class="flex items-center bg-[#FC5030] px-4 py-2 font-poppins font-semibold text-white md:px-6 md:py-2.5">
                        <Motorcycle class="mr-2 size-4 md:size-5" /> <span class="text-sm md:text-base">ORDER</span>
                    </button>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
