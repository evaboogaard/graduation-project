/**
 * Creates a CSS clamp function to interpolate between two values, between two viewport sizes
 * This is based on https://utopia.fyi
 *
 * @param {object} options
 * @param {number} options.min minimum size
 * @param {number} options.max maximum size
 * @param {number} options.vwMin viewport width minimum – defaults to 320
 * @param {number} options.vwMax viewport width maximum – defaults to 1140
 * @returns {string}
 */
export const interpolate = ({ min, max, vwMin = 320, vwMax = 1140 }) => {
  const rootSize = 16;

  if (min === max) {
    return `${min / rootSize}rem`;
  }

  // Convert the min and max sizes to rems
  const minSize = min / rootSize;
  const maxSize = max / rootSize;

  // Convert the pixel viewport sizes into rems
  const minViewport = vwMin / rootSize;
  const maxViewport = vwMax / rootSize;

  // Slope and intersection allow us to have a fluid value but also keep that sensible
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const intersection = -1 * minViewport * slope + minSize;

  return `clamp(${minSize}rem, ${intersection.toFixed(2)}rem + ${(
    slope * 100
  ).toFixed(2)}vw, ${maxSize}rem)`;
};
