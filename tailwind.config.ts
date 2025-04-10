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
        plugin(({ addUtilities, addComponents, theme }) => {
            addUtilities({
                ".border-gradient": {
                    borderImage: "var(--main-gradient) 1",
                },
            });
            addComponents({
                ".btn-bg-animate": {
                    overflow: "hidden",
                    position: "relative",

                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-100%",
                        left: "-100%",
                        width: "290%",
                        height: "330%",

                        background: "var(--main-gradient)",

                        transitionProperty: "transform",
                        transitionDuration: theme("transitionDuration.700"),
                        transform: "translateX(100%) translateY(100%) rotate(-45deg)",
                    },
                    "&:hover::before": {
                        transform: "translateX(0) translateY(0) rotate(-45deg)",
                    },
                },
            });
        }),
    ],
} satisfies Config;
