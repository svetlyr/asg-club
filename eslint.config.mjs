import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginAstro from "eslint-plugin-astro";
import pluginSolid from "eslint-plugin-solid";
import pluginTailwind from "eslint-plugin-tailwindcss";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
    { ignores: ["**/dist", "**/node_modules", "**/.astro", "**/.github", "**/.changeset", "**/*.mjs"] },

    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    pluginTailwind.configs["flat/recommended"],

    {
        files: ["**/*"],
        rules: {
            "no-unused-vars": "off",
            "no-duplicate-imports": "off",
            "tailwindcss/no-custom-classname": "off",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/explicit-module-boundary-types": "error",
        },
        languageOptions: {
            parserOptions: {
                project: false,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: globals.browser,
        },
    },

    // * Astro overrides
    pluginAstro.configs.recommended,
    {
        files: ["**/*.astro"],
        rules: {
            "astro/no-unused-css-selector": "warn",
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
        files: ["**/*.tsx"],
        rules: {
            "solid/no-array-handlers": "warn",
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "tsconfig.json",
            },
        },
        ...pluginSolid.configs["flat/typescript"],
    },

    {
        files: ["scripts/**"],
        languageOptions: {
            globals: globals.node,
        },
    },

    pluginPrettierRecommended,
);
