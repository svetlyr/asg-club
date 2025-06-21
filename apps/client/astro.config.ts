import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";

import { fileURLToPath, URL } from "node:url";
import { defineConfig, envField } from "astro/config";
import { FileSystemIconLoader } from "unplugin-icons/loaders";

export default defineConfig({
    output: "static",

    trailingSlash: "ignore",
    site: "https://asg-club.com",

    integrations: [solid(), tailwind({ applyBaseStyles: false })],
    vite: {
        plugins: [
            Icons({
                compiler: "solid",
                customCollections: {
                    custom: FileSystemIconLoader("./src/assets/icons"),
                },
            }),
        ],
        resolve: {
            alias: [
                { find: "@icons/sli", replacement: "~icons/simple-line-icons" },
                { find: "@icons/fa", replacement: "~icons/fa6-solid" },
                { find: "@icons", replacement: "~icons" },

                { find: "@assets", replacement: fileURLToPath(new URL("./src/assets", import.meta.url)) },
            ],
        },
    },
    env: {
        schema: {
            EMAIL: envField.string({ context: "server", access: "public" }),
            TIKTOK: envField.string({ context: "server", access: "public" }),
            TWITTER: envField.string({ context: "server", access: "public" }),
            YOUTUBE: envField.string({ context: "server", access: "public" }),
            DISCORD: envField.string({ context: "server", access: "public" }),
            FACEBOOK: envField.string({ context: "server", access: "public" }),
            INSTAGRAM: envField.string({ context: "server", access: "public" }),
        },
        validateSecrets: true,
    },
});
