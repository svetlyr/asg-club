import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/dist", "**/node_modules", "**/.astro", "**/.github", "**/.changeset", "**/*.mjs"],
    },

    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,

    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "no-unused-vars": "off",
            "no-duplicate-imports": "off",

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
            "@typescript-eslint/restrict-template-expressions": ["warn", { allowNumber: true }],
            "@typescript-eslint/no-confusing-void-expression": ["warn", { ignoreArrowShorthand: true }],

            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/explicit-module-boundary-types": "error",
        },
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
);
