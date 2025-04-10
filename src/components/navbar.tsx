import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import type { Component } from "solid-js";

import Link from "./link";
import Button from "./button";
import createIsMobile from "@hooks/isMobile";

import XMark from "@icons/fa6-solid/xmark";
import HamburgerMenu from "@icons/fa6-solid/bars";
import Motorcycle from "@icons/fa6-solid/motorcycle";

import asgLogo from "@assets/asg-logo.svg";
import clubLogo from "@assets/club-logo.svg";

const NAV_LINKS = [
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
];

type Props = {
    path: string;
    class?: string;
    navCollapseId: string;
};

// eslint-disable-next-line solid/no-destructure
const Navbar: Component<Props> = ({ navCollapseId, path, class: className = "" }) => {
    const navbarHeight = 74;
    const scrollThreshold = 200;
    const isMobile = createIsMobile("md");
    const [isMenuOpen, setIsMenuOpen] = createSignal<boolean>(false);
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

        if (!targetHidden) setIsCollapsed(false);
    };

    onMount(() => {
        lastScrollY = window.scrollY;
        window.addEventListener("scroll", handleScroll, { passive: true });

        let observer: IntersectionObserver | null;
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
        <>
            <header
                style={{ height: `${navbarHeight}px` }}
                classList={{ "-translate-y-full": isCollapsed(), "translate-y-0": !isCollapsed() }}
                class={`sticky top-0 w-full bg-black-primary shadow-md transition-transform duration-300 ${className}`}
            >
                <div class="container mx-auto flex h-full items-center justify-between">
                    <Link href="/" class="flex items-center">
                        <img src={asgLogo.src} alt="Logo" class="mr-2 size-14 sm:size-16 md:size-16" />
                        <img src={clubLogo.src} alt="Club text" class="size-20 sm:size-24 md:size-24" />
                    </Link>
                    <div class="flex items-center gap-4">
                        <Show when={isMobile()}>
                            <HamburgerMenu
                                class="size-6 cursor-pointer text-white md:hidden"
                                onClick={() => setIsMenuOpen(true)}
                            />
                        </Show>
                        <ul class="items-center space-x-4 font-poppins text-white md:flex md:space-x-6 lg:space-x-8">
                            <Show when={!isMobile()}>
                                <For each={NAV_LINKS}>
                                    {({ name, href }) => (
                                        <li class="hidden md:block">
                                            <Link
                                                href={href}
                                                classList={{ "text-red-primary": path.includes(href) }}
                                                class="text-sm transition-colors duration-500 ease-in-out hover:text-red-primary md:text-base lg:text-lg"
                                            >
                                                {name}
                                            </Link>
                                        </li>
                                    )}
                                </For>
                            </Show>
                            <Button class="flex items-center bg-orange-primary px-4 py-2 md:px-6">
                                <Motorcycle class="mr-2 size-4 md:size-5" />
                                <span class="text-sm md:text-base">ORDER</span>
                            </Button>
                        </ul>
                    </div>
                </div>
            </header>
            {/* TODO: add animations */}
            <Show when={isMenuOpen()}>
                <div class="pointer-events-none fixed inset-0 z-50 text-white">
                    <div
                        class="pointer-events-auto absolute inset-0 bg-black-primary/40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <ul class="pointer-events-auto relative h-[33vh] w-full bg-black-primary p-8 px-14 shadow-md">
                        <For each={NAV_LINKS}>
                            {({ name, href }) => (
                                <li class="py-2">
                                    <Link
                                        href={href}
                                        classList={{ "text-red-primary": path.includes(href) }}
                                        class="block px-4 font-poppins text-base font-bold md:text-base lg:text-lg"
                                    >
                                        {name}
                                    </Link>
                                </li>
                            )}
                        </For>
                        <XMark
                            class="absolute right-6 top-6 size-6 cursor-pointer"
                            onClick={() => setIsMenuOpen(false)}
                        />
                    </ul>
                </div>
            </Show>
        </>
    );
};

export default Navbar;
