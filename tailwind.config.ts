import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            backgroundColor: {
                black: {
                    primary: "#030301",
                    secondary: "#101010",
                    tertiary: "#181818",
                    quaternary: "#191919",
                },
            },
            colors: {},
        },
    },
    plugins: [],
} satisfies Config;
