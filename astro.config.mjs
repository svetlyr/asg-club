import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";

import { defineConfig } from "astro/config";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

export default defineConfig({
    output: "static",

    trailingSlash: "never",
    site: "https://svetlyr.github.io",
    // TODO: change when domain name is ready
    base: process.env.NODE_ENV === "production" ? "/asg-club/" : "/",

    integrations: [solid(), tailwind({ applyBaseStyles: false })],
    vite: {
        plugins: [
            Icons({
                compiler: "solid",
                customCollections: {
                    gradient: FileSystemIconLoader("./src/assets/gradient-icons", (svg) =>
                        svg.replace(/fill="currentColor"/g, 'fill="url(#main-gradient)"'),
                    ),
                },
            }),
        ],
        resolve: {
            alias: [{ find: "@icons", replacement: "~icons" }],
        },
    },
});
