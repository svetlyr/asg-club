// @ts-check
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginAstro from "eslint-plugin-astro";
import pluginSolid from "eslint-plugin-solid";
import pluginTailwind from "eslint-plugin-tailwindcss";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import baseConfig from "../../eslint.config.mjs";

export default tseslint.config(
    baseConfig,
    pluginTailwind.configs["flat/recommended"],

    {
        settings: {
            tailwindcss: {
                callees: ["tw"],
                config: "./tailwind.config.ts",
            },
        },
    },

    {
        files: ["**/*.astro", "**/*.ts", "**/*.tsx"],
        rules: {
            "tailwindcss/no-custom-classname": "off",
        },
    },

    // * Astro overrides
    pluginAstro.configs.recommended,
    {
        files: ["**/*.astro"],
        rules: {
            "astro/no-unused-css-selector": "off",
            "astro/no-set-html-directive": "error",
            "astro/no-set-text-directive": "error",
        },
        languageOptions: {
            parserOptions: {
                project: true,
                projectService: false,
                extraFileExtensions: [".astro"],
            },
            globals: globals.browser,
        },
    },

    // * Solid overrides
    {
        files: ["**/*.ts", "**/*.tsx"],
        ...pluginSolid.configs["flat/typescript"],

        languageOptions: {
            parser: tseslint.parser,
            globals: globals.browser,
        },
        rules: {
            ...pluginSolid.configs["flat/typescript"].rules,

            "solid/no-array-handlers": "warn",
        },
    },

    pluginPrettierRecommended,
);
