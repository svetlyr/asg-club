/* eslint-disable @typescript-eslint/unbound-method */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { fontFamily } from "tailwindcss/defaultTheme";

const { sans, serif } = fontFamily;

export default {
    content: ["./src/**/*.{astro,tsx}"],
    theme: {
        extend: {
            colors: {
                gray: { primary: "#8E8E8E" },
                red: { primary: "#FC5130" },
                orange: { primary: "#FC5030" },
                black: {
                    primary: "#030301",
                    secondary: "#101010",
                    tertiary: "#181818",
                    quaternary: "#191919",
                },
            },
            backgroundImage: {
                "main-gradient": "var(--main-gradient)",
            },
            fontFamily: {
                gilroy: ["Gilroy", ...serif],
                poppins: ["Poppins", ...sans],
                "roboto-slab": ["Roboto Slab Variable", ...serif],

                // * Overwrite default font
                sans: ["Roboto", ...sans],
            },
        },
    },
    plugins: [
        plugin(({ addUtilities }) => {
            addUtilities({
                ".border-gradient": {
                    borderImage: "var(--main-gradient) 1",
                },
            });
        }),
    ],
} satisfies Config;
