import path from "path";
import bun from "@nurodev/astro-bun";
import solid from "@astrojs/solid-js";
import Icons from "unplugin-icons/vite";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import type { Plugin } from "vite";

export default defineConfig({
    adapter: bun(),
    output: "server",

    trailingSlash: "never",
    site: "https://svetlyr.github.io",
    // TODO: change when domain name is ready
    base: process.env.NODE_ENV === "production" ? "/asg-club/" : "/",

    integrations: [solid(), tailwind({ applyBaseStyles: false })],
    vite: {
        plugins: [Icons({ compiler: "solid" }), envAliasPlugin()],
        resolve: {
            alias: [
                { find: "@icons/sli", replacement: "~icons/simple-line-icons" },
                { find: "@icons/fa", replacement: "~icons/fa6-solid" },
                { find: "@icons", replacement: "~icons" },
            ],
        },
    },
});

// * Dynamically import env vars from @env
// * Doesn't leak t3-env (zod3 dependency) to the client
function envAliasPlugin(): Plugin {
    return {
        name: "env-alias",
        enforce: "pre",
        resolveId(id): string | null {
            if (id === "@env") return id;
            return null;
        },
        load(id, { ssr } = {}): string | null {
            if (id === "@env") {
                const target = ssr ? "./src/env/server.ts" : "./src/env/client.ts";
                // * Emit an ESM proxy so imports from "@env" just forward
                return `export * from ${JSON.stringify(path.resolve(target))};`;
            }
            return null;
        },
    };
}
