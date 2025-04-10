// import { calculateSpaceScale } from "utopia-core";

import { interpolate } from "../../utils/css/interpolate";

/**
 * Define your spacing scale here
 * You can use the `calculateSpaceScale` function from `utopia-core` to generate a scale, visually customizable on https://utopia.fyi/space/calculator/ and copyable to your project in the "PostCSS" tab on the site
 * Or you can write your own scale manually with the `interpolate` function
 */
export const spacing = {
  "3xs": "clamp(0.3125rem, 0.3125rem + 0vw, 0.3125rem)",
  "2xs": "clamp(0.5625rem, 0.5051rem + 0.2353vw, 0.6875rem)",
  xs: "clamp(0.875rem, 0.8176rem + 0.2353vw, 1rem)",
  s: "clamp(1.125rem, 1.039rem + 0.3529vw, 1.3125rem)",
  m: "clamp(1.6875rem, 1.5441rem + 0.5882vw, 2rem)",
  l: "clamp(2.25rem, 2.0779rem + 0.7059vw, 2.625rem)",
  xl: "clamp(3.375rem, 3.1169rem + 1.0588vw, 3.9375rem)",
  "2xl": "clamp(4.5rem, 4.1559rem + 1.4118vw, 5.25rem)",
  "3xl": "clamp(6.75rem, 6.2338rem + 2.1176vw, 7.875rem)",

  "3xs-2xs": "clamp(0.3125rem, 0.1404rem + 0.7059vw, 0.6875rem)",
  "2xs-xs": "clamp(0.5625rem, 0.3618rem + 0.8235vw, 1rem)",
  "xs-s": "clamp(0.875rem, 0.6743rem + 0.8235vw, 1.3125rem)",
  "s-m": "clamp(1.125rem, 0.7235rem + 1.6471vw, 2rem)",
  "m-l": "clamp(1.6875rem, 1.2574rem + 1.7647vw, 2.625rem)",
  "l-xl": "clamp(2.25rem, 1.4757rem + 3.1765vw, 3.9375rem)",
  "xl-2xl": "clamp(3.375rem, 2.5147rem + 3.5294vw, 5.25rem)",
  "2xl-3xl": "clamp(4.5rem, 2.9515rem + 6.3529vw, 7.875rem)",
};

/**
 * Example of using `calculateSpaceScale` to generate a scale
 */

// const spaceScale = calculateSpaceScale({
//   minWidth: 320,
//   maxWidth: 1140,
//   minSize: 16,
//   maxSize: 20,
//   positiveSteps: [1.5, 2, 3, 4, 6],
//   negativeSteps: [0.75, 0.5, 0.25],
//   // customSizes: ["m-xl"],
//   prefix: "space",
// });

// export const spacing = [
//   ...spaceScale.sizes,
//   ...spaceScale.oneUpPairs,
//   ...spaceScale.customPairs,
// ].reduce(
//   (obj, item) => ({
//     ...obj,
//     ...{ [item.label]: item.clamp },
//   }),
//   {}
// );
