/**
 * Fetch Meta Images Transform
 *
 * This transform is developed to be used in conjunction with DatoCMS and the meta tags
 * generated from the _seoMetaTags data. It is responsible for processing Open Graph
 * and Twitter card images in HTML files. It performs the following tasks:
 *
 * 1. Finds Open Graph and Twitter image meta tags in HTML files, typically generated
 *    from DatoCMS _seoMetaTags data.
 * 2. Downloads the images specified in these meta tags from DatoCMS.
 * 3. Saves the images locally in the 'dist/assets/images/social-share' directory.
 * 4. Updates the meta tags to point to the local copies of the images.
 * 5. Converts SVG images to PNG format if necessary.
 *
 * This transform ensures that social media share images are available locally,
 * potentially improving page load times and reducing dependency on external services.
 *
 * How it's included in .eleventy.js:
 * This transform is added to the Eleventy configuration using the addTransform method:
 *
 * config.addTransform("fetchMetaImages", fetchMetaImages);
 *
 * This ensures that the transform is applied to all HTML files during the build process,
 * processing the meta tags generated from DatoCMS _seoMetaTags.
 */

import { JSDOM } from "jsdom";
import path from "path";
import fs from "fs/promises";
import EleventyFetch from "@11ty/eleventy-fetch";
import siteData from "../../_data/site.js";

export const fetchMetaImages = async (content, outputPath) => {
  // Only process HTML files
  if (!outputPath || !outputPath.endsWith(".html")) {
    return content;
  }

  // Parse the HTML content
  const dom = new JSDOM(content);
  const document = dom.window.document;

  // Find Open Graph and Twitter meta tags for images
  const ogImage = document.querySelector('meta[property="og:image"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');

  // If neither OG nor Twitter image is found, return the original content
  if (!ogImage && !twitterImage) {
    return content;
  }

  // Get the image URL from either OG or Twitter meta tag
  const imageUrl =
    (ogImage && ogImage.getAttribute("content")) ||
    (twitterImage && twitterImage.getAttribute("content"));

  if (!imageUrl) {
    return content;
  }

  try {
    // Parse the image URL
    const urlObj = new URL(imageUrl);
    let filename = path.basename(urlObj.pathname);

    // Change the extension from .svg to .png if the file is an SVG
    if (path.extname(filename).toLowerCase() === ".svg") {
      filename = path.basename(filename, ".svg") + ".png";
    }

    const outputDir = "dist/assets/images/social-share";
    const imagePath = path.join(outputDir, filename);

    // Check if the image file already exists
    const fileExists = await fs
      .access(imagePath)
      .then(() => true)
      .catch(() => false);

    console.log("IMAGE URL:::::::", imageUrl);
    if (!fileExists) {
      // Fetch the image if it doesn't exist locally
      const imageBuffer = await EleventyFetch(imageUrl, {
        duration: "1d", // Cache the image for 1 day
        type: "buffer",
      });

      // Create the output directory if it doesn't exist
      await fs.mkdir(outputDir, { recursive: true });
      // Save the image file
      await fs.writeFile(imagePath, imageBuffer);
      console.log(`[META TRANSFORM] done for ${filename} – downloaded`);
    } else {
      console.log(`[META TRANSFORM] done for ${filename} – reused`);
    }

    // Update the image URL to point to the local copy
    const newImagePath = `${siteData.url}/assets/images/social-share/${filename}`;
    if (ogImage) {
      ogImage.setAttribute("content", newImagePath);
    }
    if (twitterImage) {
      twitterImage.setAttribute("content", newImagePath);
    }

    // Return the updated HTML content
    return dom.serialize();
  } catch (error) {
    console.error(`Error processing image for ${outputPath}:`, error);
    // If there's an error, return the original content
    return content;
  }
};
