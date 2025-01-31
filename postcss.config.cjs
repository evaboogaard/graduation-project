const autoprefixer = require("autoprefixer");

const postcssPresetEnv = require("postcss-preset-env");
const postcssImport = require("postcss-import");
const postcssImportGlob = require("postcss-import-ext-glob");
const cssnano = require("cssnano");
const tailwind = require("tailwindcss");

/** @type {import('postcss-load-config').Config} */
module.exports = {
  map: process.env.NODE_ENV === "production" ? false : { inline: true },
  from: "src/assets/css/global.css",
  to: "dist/assets/css/global.css",
  plugins: [
    postcssImportGlob(),
    postcssImport(),
    postcssPresetEnv({
      stage: 1,
      features: {
        "nesting-rules": true,
        "custom-properties": false,
        "custom-media-queries": true,
        "prefers-color-scheme-query": false,
        "focus-visible-pseudo-class": false,
        "logical-properties-and-values": false,
      },
    }),
    tailwind(),
    autoprefixer(),
    ...(process.env.NODE_ENV === "production" ? [cssnano()] : []),
  ],
};
