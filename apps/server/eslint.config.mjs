import globals from "globals";
import tseslint from "typescript-eslint";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import baseConfig from "../../eslint.config.mjs";

export default tseslint.config(
    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: true,
                projectService: false,
            },
            globals: globals.node,
        },
    },

    baseConfig,
    pluginPrettierRecommended,
);
