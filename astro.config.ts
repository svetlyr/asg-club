import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";

import { fileURLToPath, URL } from "node:url";
import { defineConfig, envField } from "astro/config";
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
            TIKTOK: envField.string({ context: "server", access: "public" }),
            YOUTUBE: envField.string({ context: "server", access: "public" }),
            FACEBOOK: envField.string({ context: "server", access: "public" }),
            INSTAGRAM: envField.string({ context: "server", access: "public" }),

            EMAIL: envField.string({ context: "server", access: "public" }),
            VIBER: envField.string({ context: "server", access: "public" }),
            DISCORD: envField.string({ context: "server", access: "public" }),
            WHATSAPP: envField.string({ context: "server", access: "public" }),
            TELEGRAM: envField.string({ context: "server", access: "public" }),

            // EMAIL: envField.string({ context: "server", access: "secret" }),
        },
        validateSecrets: true,
    },
});
