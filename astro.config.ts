import bun from "@nurodev/astro-bun";
import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";

import { defineConfig, envField } from "astro/config";

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
            alias: [
                { find: "@icons/sli", replacement: "~icons/simple-line-icons" },
                { find: "@icons/fa", replacement: "~icons/fa6-solid" },
                { find: "@icons", replacement: "~icons" },
            ],
        },
    },
    env: {
        schema: {
            BALLS: envField.string({ context: "client", access: "public" }),
            TIKTOK: envField.string({ context: "server", access: "public" }),
            YOUTUBE: envField.string({ context: "server", access: "public" }),
            FACEBOOK: envField.string({ context: "server", access: "public" }),
            INSTAGRAM: envField.string({ context: "server", access: "public" }),

            EMAIL: envField.string({ context: "server", access: "secret" }),
        },
        validateSecrets: true,
    },
});
