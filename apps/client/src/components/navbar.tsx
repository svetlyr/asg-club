import type { Component } from "solid-js";
import { useWindowScrollPosition } from "@solid-primitives/scroll";
import { createVisibilityObserver } from "@solid-primitives/intersection-observer";
import { createComputed, createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";

import { Link } from "./link";
import { Button } from "./button";
import { createIsMobile } from "@hooks/isMobile";

import XMark from "@icons/fa/xmark";
import HamburgerMenu from "@icons/fa/bars";
import Motorcycle from "@icons/fa/motorcycle";

import asgLogo from "@assets/asg-logo.svg";
import clubLogo from "@assets/club-logo.svg";

const navCollapseId = "navCollapseTarget";
const navigationLinks = [
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery", prefetch: true },
    { name: "Contact Us", href: "/contact" },
];

type Props = {
    path: string;
    class?: string;
};

// eslint-disable-next-line solid/no-destructure
const Navbar: Component<Props> = ({ path, class: className = "" }) => {
    const navbarHeight = 74;
    const scrollThreshold = 200;
    const isMobile = createIsMobile("md");
    const scroll = useWindowScrollPosition();
    const [isMenuOpen, setIsMenuOpen] = createSignal<boolean>(false);
    const [isNavbarVisible, setIsNavbarVisible] = createSignal<boolean>(true);

    let lastScrollY: number;
    let accumulatedScroll: number;
    onMount(() => {
        accumulatedScroll = 0;
        lastScrollY = scroll.y;
    });

    const isTargetVisible = createVisibilityObserver(
        {
            threshold: [0],
            rootMargin: `-${navbarHeight}px 0px 0px 0px`,
        },
        (entry) => entry.isIntersecting,
    )(() => document.getElementById(navCollapseId));

    createComputed(() => {
        if (isTargetVisible() && isNavbarVisible()) return;

        const currentScrollY = scroll.y;
        const delta = currentScrollY - lastScrollY;

        lastScrollY = currentScrollY;
        accumulatedScroll -= delta;

        // * scroll down
        if (accumulatedScroll <= -scrollThreshold) {
            setIsNavbarVisible(false);
            accumulatedScroll = 0;
            return;
        }

        // * scroll up
        if (accumulatedScroll >= scrollThreshold) {
            setIsNavbarVisible(true);
            accumulatedScroll = 0;
        }
    });

    createEffect(() => {
        // * prevent page scroll when menu is open
        document.body.style.overflow = isMenuOpen() ? "hidden" : "";

        onCleanup(() => (document.body.style.overflow = ""));
    });

    return (
        <>
            <header
                style={{ height: `${navbarHeight}px` }}
                classList={{ "translate-y-0": isNavbarVisible(), "-translate-y-full": !isNavbarVisible() }}
                class={`sticky top-0 z-20 w-full bg-black-primary shadow-md transition-transform duration-300 px-global ${className}`}>
                <div
                    class="animate-appear-down container mx-auto flex h-full items-center justify-between"
                    style={{ "animation-delay": "500ms" }}>
                    <Link href="/" class="flex items-center">
                        <img
                            alt="Logo"
                            loading="eager"
                            fetchpriority="high"
                            src={asgLogo.src}
                            class="mr-2 size-14 sm:size-16 md:size-16"
                        />
                        <img
                            alt="Club text"
                            loading="eager"
                            fetchpriority="high"
                            src={clubLogo.src}
                            class="size-20 sm:size-24 md:size-24"
                        />
                    </Link>
                    <div class="flex items-center gap-4">
                        <Show when={isMobile()}>
                            <HamburgerMenu
                                class="size-6 cursor-pointer text-white md:hidden"
                                onClick={() => setIsMenuOpen(true)}
                            />
                        </Show>
                        <ul class="items-center space-x-4 text-white md:flex md:space-x-6 lg:space-x-8">
                            <Show when={!isMobile()}>
                                <For each={navigationLinks}>
                                    {({ name, href, prefetch }) => (
                                        <li class="hidden md:block">
                                            <Link
                                                href={href}
                                                data-astro-prefetch={prefetch}
                                                classList={{ "text-red-primary": path.includes(href) }}
                                                class="text-sm transition-colors duration-500 ease-in-out hover:text-red-primary md:text-base lg:text-lg">
                                                {name}
                                            </Link>
                                        </li>
                                    )}
                                </For>
                            </Show>
                            <Button
                                href="#form"
                                class="group btn-bg-animate flex items-center bg-transparent border-gradient md:px-6">
                                <Motorcycle class="mr-2 size-4 md:size-5" />
                                <span class="text-sm md:text-base group-hover:[&_path]:fill-white">ORDER</span>
                            </Button>
                        </ul>
                    </div>
                </div>
            </header>
            {/* TODO: add animations */}
            <Show when={isMenuOpen()}>
                <div class="pointer-events-none fixed inset-0 z-30 text-white">
                    <div
                        class="pointer-events-auto absolute inset-0 bg-black-primary/40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <ul class="pointer-events-auto relative h-[33vh] w-full bg-black-primary p-8 px-14 shadow-md">
                        <For each={navigationLinks}>
                            {({ name, href }) => (
                                <li class="py-2">
                                    <Link
                                        href={href}
                                        classList={{ "text-red-primary": path.includes(href) }}
                                        class="block px-4 text-base font-bold md:text-base lg:text-lg">
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

export { Navbar as default, navCollapseId };
