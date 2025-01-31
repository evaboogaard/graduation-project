require("dotenv").config();

function calculateTargetSize(widths, ratio, originWidth) {
  // Sort the widths array in descending order (largest to smallest)
  widths.sort((a, b) => b - a);

  // Start with the smallest width as a fallback
  let targetWidth = widths[widths.length - 1];

  // Iterate through the widths from largest to smallest
  for (let width of widths) {
    // If we find a width that's equal to or smaller than the original width,
    // use it as the target width and stop searching
    if (width <= originWidth) {
      targetWidth = width;
      break;
    }
    // If we don't find a suitable width, we'll use the smallest width (set initially)
  }

  // Calculate the target height based on the selected width and the aspect ratio
  const targetHeight = Math.floor(targetWidth / ratio);

  return { targetWidth, targetHeight };
}

module.exports = (datoImage) => {
  // Check if at least the imgObj is valid
  if (datoImage.imgObj.data === null || !datoImage.imgObj) {
    return "Dato image url must be provided";
  }
  const imgData = datoImage.imgObj;

  if (
    imgData.mimeType == undefined ||
    imgData.mimeType.startsWith("image") == false
  ) {
    return "imgObj must be a valid dato image object";
  }

  // Deconstruct datoImage and provide fallbacks for undefined values
  // These are all the possible parameters for the shortcode aprart from the imgData
  const {
    formats = "webp",
    widths = [400, 800],
    sizes = "(min-width: 22em) 30vw, 100vw",
    classes = "",
    fit = "crop",
    loading = "lazy",
    decoding = "async",
    ratio,
    emptyAlt,
    pictureClass = "",
  } = datoImage;

  // Extract essential information from the provided image object
  const imgUrl = imgData.url;
  const originWidth = imgData.width;
  const originHeight = imgData.height;

  // Determine the target aspect ratio:
  // If a custom ratio is provided, use it; otherwise, calculate from original dimensions
  const targetRatio = ratio ? ratio : originWidth / originHeight;

  // Set the focal point for image cropping:
  // Use the provided focal point if available, otherwise default to center (0.5, 0.5)
  const focalPoint = imgData.focalPoint
    ? imgData.focalPoint
    : { x: 0.5, y: 0.5 };

  // Check if the image is an SVG and if SVG format is requested
  let isSvg = false;
  if (imgData.mimeType == "image/svg+xml" && formats.includes("svg")) {
    isSvg = true;
  }

  // Prepare the alt text, replacing double quotes with HTML entities
  let alt = imgData.alt || "";
  alt = alt.replaceAll('"', "&quot;");
  if (emptyAlt === "true") {
    alt = "";
  }

  // Calculate target dimensions based on the aspect ratio
  const targetSize = calculateTargetSize(widths, targetRatio, originWidth);

  // Construct the Dato CMS image URL with transformation parameters
  // prettier-ignore
  const datoImageUrl = `${imgUrl}?fit=${fit}&fp-x=${focalPoint["x"]}&fp-y=${focalPoint["y"]}&w=${targetSize.targetWidth}&h=${targetSize.targetHeight}`;

  // Generate the appropriate HTML for the image
  let generatedPicture;

  if (!isSvg) {
    generatedPicture = `
      <picture ${pictureClass ? `class="${pictureClass}"` : ""}>
        <img class="${classes}" alt="${alt}" src="${datoImageUrl}" eleventy:widths="${widths}" eleventy:formats="${formats}" sizes="${sizes}" loading="${loading}" decoding="${decoding}"/>
      </picture>
    `;
  } else {
    generatedPicture = `
    <picture ${pictureClass ? `class="${pictureClass}"` : ""}>
      <img eleventy:formats="svg" class="${classes}" alt="${alt}" src="${imgUrl}">
    </picture>`;
  }

  return generatedPicture;
};
