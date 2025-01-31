/**
 * Read more about adding custom utilities in the README file.
 */

import postcss from "postcss";
import postcssJs from "postcss-js";
import plugin from "tailwindcss/plugin";

import { colors } from "./src/assets/design-tokens/colors";
import { fontSize } from "./src/assets/design-tokens/font-size";
import { fontWeight } from "./src/assets/design-tokens/font-weight";
import { lineHeight } from "./src/assets/design-tokens/line-height";
import { spacing } from "./src/assets/design-tokens/spacing";
import { fontFamily } from "./src/assets/design-tokens/font-family";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,njk}"],
  /**
   * Add Design Tokens to Tailwind
   * https://tailwindcss.com/docs/theme
   */
  theme: {
    colors: colors,
    spacing: spacing,
    fontSize: fontSize,
    lineHeight: lineHeight,
    fontWeight: fontWeight,
    fontFamily: fontFamily,
  },
  /**
   * Disable all plugins, except the ones we need as utilities
   */
  corePlugins: [
    "backgroundColor",
    "textColor",
    "fontSize",
    "lineHeight",
    "fontFamily",
    "fontStyle",
    "textDecoration",
  ],
  blocklist: ["container"],
  experimental: {
    optimizeUniversalDefaults: true,
  },

  plugins: [
    /**
     * Generate CSS Vars from theme
     */
    plugin(({ addComponents, config }) => {
      let result = "";

      const currentConfig = config();

      const groups = [
        { key: "colors", prefix: "color" },
        { key: "spacing", prefix: "space" },
        { key: "fontSize", prefix: "text" },
        { key: "lineHeight", prefix: "leading" },
        { key: "fontWeight", prefix: "weight" },
        { key: "fontFamily", prefix: "font" },
      ];

      groups.forEach(({ key, prefix }) => {
        const group = currentConfig.theme[key];
        if (!group) return;

        // TOOD: refer to vars in utlities
        Object.entries(group).forEach(([key, value]) => {
          // Replace dots with underscores, like "0.5" => "0_5"
          if (key.includes(".")) key = key.replaceAll(".", "_");

          result += `--${prefix}-${key.toLowerCase()}: ${value};`;
        });
      });

      addComponents({
        ":root, ::backdrop": postcssJs.objectify(postcss.parse(result)),
      });
    }),

    /**
     * Add custom utilities that are not included in Tailwind or don't have a 1:1 name-mapping, like `weight-*` and `stack-*` (instead of `font-*` and `space-y-*`)
     */
    plugin(({ matchUtilities, theme }) => {
      // Font weight
      matchUtilities(
        {
          // => the key `weight` becomes the prefix for the utility (`weight-*` => e.g. `weight-bold`)
          weight: (value) => ({
            // here we define the CSS rules for the utility, but in JavaScript objects. For nested rules, see the `stack` utility below
            "font-weight": value,
          }),
        },

        { values: theme("fontWeight") } // => the values for the generated utilities above are taken from the theme tokens which are defined above in the `theme` object
      );

      // Stack
      matchUtilities(
        {
          // Stack
          stack: (value) => ({
            ":where(&) > * + *": {
              "--stack-space": value,
              "margin-block-start": "var(--stack-space, 1rem)",
            },
          }),

          // Override stack child margin
          "my-stack-space": (value) => ({
            "--stack-space": value,
          }),
        },
        { values: theme("spacing") }
      );
    }),
  ],
};
