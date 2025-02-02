// @ts-check
import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [solid(), tailwind()],
    vite: {
        plugins: [Icons({ compiler: "solid" })],
        resolve: {
            alias: [{ find: "@icons", replacement: "~icons" }],
        },
    },
});
