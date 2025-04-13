/** @type {import("prettier").Config} */
export default {
    semi: true,
    tabWidth: 4,
    printWidth: 120,
    singleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    arrowParens: "always",
    bracketSameLine: true,

    overrides: [{ files: "*.astro", options: { parser: "astro" } }],
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
};
