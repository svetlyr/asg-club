import { createSignal, onCleanup, onMount } from "solid-js";
import type { Component } from "solid-js";

import Link from "./link";
import logo from "@assets/astro.svg";

const Navbar: Component = () => {
    const [isCollapsed, setIsCollapsed] = createSignal<boolean>(false);

    let lastScrollY: number;
    let ticking: boolean = false;

    const handleScroll = (): void => {
        const currentScrollY = window.scrollY;
        const shouldCollapse = currentScrollY > lastScrollY;

        if (isCollapsed() === shouldCollapse) {
            lastScrollY = currentScrollY;
            return;
        }

        if (ticking) return;

        ticking = true;
        window.requestAnimationFrame(() => {
            setIsCollapsed(shouldCollapse);
            lastScrollY = currentScrollY;
            ticking = false;
        });
    };

    onMount(() => {
        lastScrollY = window.scrollY;
        window.addEventListener("scroll", handleScroll, { passive: true });
        onCleanup(() => window.removeEventListener("scroll", handleScroll));
    });

    return (
        <header
            class={`fixed top-0 flex w-full items-center bg-black-primary shadow-md transition-transform duration-300 ${isCollapsed() ? "-translate-y-full" : "translate-y-0"}`}
        >
            <Link href="/">
                {/* TODO: logo */}
                <img src={logo.src} alt="Logo" class="bg-white" />
            </Link>
            <ul>
                <li class="text-white">
                    <Link href="/">Services</Link>
                    <Link href="/">About Us</Link>
                    <Link href="/">Contact</Link>
                </li>
            </ul>
        </header>
    );
};

export default Navbar;
