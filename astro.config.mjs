import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";
import bun from "@nurodev/astro-bun";

import { defineConfig } from "astro/config";

export default defineConfig({
    adapter: bun(),
    output: "server",

    trailingSlash: "never",
    site: "https://svetlyr.github.io",
    // TODO: change when domain name is ready
    base: process.env.NODE_ENV === "production" ? "/asg-club/" : "/",

    integrations: [solid(), tailwind({ applyBaseStyles: false })],
    vite: {
        plugins: [Icons({ compiler: "solid" })],
        resolve: {
            alias: [{ find: "@icons", replacement: "~icons" }],
        },
    },
});
