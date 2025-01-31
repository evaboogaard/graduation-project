// import { calculateTypeScale } from "utopia-core";
import { interpolate } from "../../utils/css/interpolate";

/**
 * Define your font-size scale here
 * You can use the `calculateTypeScale` function from `utopia-core` to generate a scale, visually customizable on https://utopia.fyi/type/calculator/ and copyable to your project in the "PostCSS" tab on the site
 */
export const fontSize = {
  "step--2": "0.75rem",
  "step--1": "0.875rem",
  "step-0": "1rem",
  "step-1": "1.125rem",
  "step-2": "1.25rem",
  "step-3": "1.5rem",
  "step-4": interpolate({ min: 24, max: 32 }),
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
