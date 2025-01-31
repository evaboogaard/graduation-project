// import { calculateSpaceScale } from "utopia-core";

import { interpolate } from "../../utils/css/interpolate";

/**
 * Define your spacing scale here
 * You can use the `calculateSpaceScale` function from `utopia-core` to generate a scale, visually customizable on https://utopia.fyi/space/calculator/ and copyable to your project in the "PostCSS" tab on the site
 * Or you can write your own scale manually with the `interpolate` function
 */
export const spacing = {
  xs: "0.25rem",
  s: "0.5rem",
  m: "1rem",
  l: "2rem",
  xl: "4rem",
  "2xl": "8rem",
  "3xl": interpolate({ min: 128, max: 256, vwMin: 480, vwMax: 1440 }),
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
