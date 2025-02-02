import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    // mode: "jit",
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
            fontFamily: {
                sans: ["Roboto", ...defaultTheme.fontFamily.sans],
                "roboto-slab": ["Roboto Slab Variable"],
                poppins: ["Poppins"],
            },
            colors: {},
        },
    },
    plugins: [],
} satisfies Config;
