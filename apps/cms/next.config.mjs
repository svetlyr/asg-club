// @ts-check
import { createJiti } from "jiti/native";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";

// TODO: prod optimizations for server and cms

const jiti = createJiti(fileURLToPath(import.meta.url));
await jiti.import("./src/env.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],

    webpack: (webpackConfig) => {
        webpackConfig.resolve.extensionAlias = {
            ".cjs": [".cts", ".cjs"],
            ".js": [".ts", ".tsx", ".js", ".jsx"],
            ".mjs": [".mts", ".mjs"],
        };

        return webpackConfig;
    },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
