// import { calculateTypeScale } from "utopia-core";
// import { interpolate } from "../../utils/css/interpolate";

/**
 * Define your font-size scale here
 * You can use the `calculateTypeScale` function from `utopia-core` to generate a scale, visually customizable on https://utopia.fyi/type/calculator/ and copyable to your project in the "PostCSS" tab on the site
 */
export const fontSize = {
  "--step--2": "clamp(0.7813rem, 0.7543rem + 0.1106vw, 0.84rem)",
  "--step--1": "clamp(0.9375rem, 0.8859rem + 0.2118vw, 1.05rem)",
  "--step-0": "clamp(1.125rem, 1.039rem + 0.3529vw, 1.3125rem)",
  "--step-1": "clamp(1.35rem, 1.2167rem + 0.5471vw, 1.6406rem)",
  "--step-2": "clamp(1.62rem, 1.4223rem + 0.8109vw, 2.0508rem)",
  "--step-3": "clamp(1.944rem, 1.6598rem + 1.1661vw, 2.5635rem)",
  "--step-4": "clamp(2.3328rem, 1.9329rem + 1.6406vw, 3.2043rem)",
  "--step-5": "clamp(2.7994rem, 2.246rem + 2.2703vw, 4.0054rem)",
  "--step-6": "clamp(3.3592rem, 2.6033rem + 3.1013vw, 5.0068rem)",

  "--step-2-3": "clamp(1.62rem, 1.187rem + 1.78vw, 2.563rem)",
  "--step-5-6": "clamp(2.75rem, 1.718rem + 4.24vw, 5rem)",
};

/**
 * Example of using `calculateTypeScale` to generate a scale
 */

// calculateTypeScale({
//   minWidth: 320,
//   maxWidth: 1140,
//   minFontSize: 16,
//   maxFontSize: 20,
//   minTypeScale: 1.2,
//   maxTypeScale: 1.25,
//   positiveSteps: 5,
//   negativeSteps: 2,
//   prefix: "step",
// }).reduce(
//   (obj, item) => ({
//     ...obj,
//     ...{ [`step-${item.step}`]: item.clamp },
//   }),
//   {}
// );
