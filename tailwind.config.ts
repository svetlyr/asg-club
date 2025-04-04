import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.{astro,tsx}"],
    theme: {
        extend: {
            colors: {
                red: { primary: "#fc5130" },
                orange: { primary: "#FC5030" },
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
        },
    },
    plugins: [],
} satisfies Config;
