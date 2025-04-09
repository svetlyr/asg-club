// @ts-check
import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    output: "static",

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
