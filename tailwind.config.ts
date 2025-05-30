/* eslint-disable @typescript-eslint/unbound-method */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { fontFamily } from "tailwindcss/defaultTheme";

import tailwindChildren from "tailwind-children";

const { sans, serif } = fontFamily;

export default {
    content: ["./src/**/*.{astro,tsx,scss}"],
    theme: {
        extend: {
            colors: {
                gray: {
                    primary: "#8E8E8E",
                    secondary: "#FFFFFF40",
                },
                red: { primary: "#FC5130" },
                orange: { primary: "#FC5030" },
                black: {
                    primary: "#030301",
                    secondary: "#101010",
                    tertiary: "#161616",
                    quaternary: "#191919",
                },
            },
            backgroundImage: {
                gradient: "var(--main-gradient)",
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
        tailwindChildren,
        plugin(({ addUtilities, addComponents, theme }) => {
            addUtilities({
                ".icon-gradient": {
                    "& path": {
                        fill: "url(#main-gradient)",
                    },
                },
                ".border-gradient": {
                    borderImage: "var(--main-gradient) 1",
                },
                ".px-global": {
                    paddingLeft: theme("spacing.6"),
                    paddingRight: theme("spacing.6"),

                    "@media (min-width: 640px)": {
                        paddingLeft: theme("spacing.8"),
                        paddingRight: theme("spacing.8"),
                    },
                    "@media (min-width: 768px)": {
                        paddingLeft: theme("spacing.10"),
                        paddingRight: theme("spacing.10"),
                    },
                    "@media (min-width: 1024px)": {
                        paddingLeft: theme("spacing.16"),
                        paddingRight: theme("spacing.16"),
                    },
                },
            });
            addComponents({
                ".text-gradient": {
                    color: "transparent",
                    backgroundClip: "text",
                    backgroundImage: theme("backgroundImage.gradient"),
                },
                ".btn-bg-animate": {
                    overflow: "hidden",
                    position: "relative",

                    "> *": {
                        zIndex: "10",
                    },

                    "astro-slot > *": {
                        zIndex: "10",
                    },

                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-100%",
                        left: "-100%",
                        width: "290%",
                        height: "410%",
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
