/**
 * You may import this file via the `script` shortcode into your base.njk layout file for sitewide scripts or create other files and import them into a specific site template.
 * You can install node modules via npm and import them here, or import other functions you wrote, e.g.:
 * `import gsap from 'gsap';`
 * `import { myFunction } from './myFunction';`
 */

import "./font-selector.js";
import "./url-params.js";
import "./type-control-panel.js";
import "./main-control-panel.js";
import "./grid-debugger.js";

import { calculateTypeScale } from "https://esm.sh/utopia-core";

// Initial configuration
const initialOptions = {
  minWidth: 390,
  maxWidth: 1650,
  minFontSize: 18,
  maxFontSize: 21,
  minTypeScale: 1.2,
  maxTypeScale: 1.25,
  positiveSteps: 6,
  negativeSteps: 1,
};

let currentOptions = { ...initialOptions };

// Function to generate and apply CSS variables
function generateAndApplyCSSVariables(fontSteps) {
  const root = document.documentElement; // Reference to the <html> element

  fontSteps.forEach((stepObj) => {
    const varName = `--step-${stepObj.step}`;
    const varValue = stepObj.clamp;

    // Apply the CSS variable to :root
    root.style.setProperty(varName, varValue);
  });

  // Optional: Log the generated CSS variables
  console.log("Generated CSS Variables:", fontSteps);

  root.style.setProperty("--min-type-scale", currentOptions.minTypeScale);
  root.style.setProperty("--max-type-scale", currentOptions.maxTypeScale);
}

// Function to update font steps based on current options
function updateFontSteps() {
  const fontSteps = calculateTypeScale(currentOptions);
  generateAndApplyCSSVariables(fontSteps);
}

// Initialize sliders and add event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Get slider elements
  const minFontSizeSlider = document.getElementById("minFontSize");
  const maxFontSizeSlider = document.getElementById("maxFontSize");
  const minTypeScaleSlider = document.getElementById("minTypeScale");
  const maxTypeScaleSlider = document.getElementById("maxTypeScale");
  const contentWidthSlider = document.getElementById("contentWidth");
  const lineHeightSlider = document.getElementById("lineHeight");

  // Get value display elements
  const minFontSizeValue = document.getElementById("minFontSizeValue");
  const maxFontSizeValue = document.getElementById("maxFontSizeValue");
  const minTypeScaleValue = document.getElementById("minTypeScaleValue");
  const maxTypeScaleValue = document.getElementById("maxTypeScaleValue");
  const contentWidthValue = document.getElementById("contentWidthValue");
  const lineHeightValue = document.getElementById("lineHeightValue");

  // Function to handle slider changes
  function handleSliderChange() {
    // Update currentOptions based on slider values
    currentOptions.minFontSize = parseInt(minFontSizeSlider.value);
    currentOptions.maxFontSize = parseInt(maxFontSizeSlider.value);
    currentOptions.minTypeScale = parseFloat(minTypeScaleSlider.value);
    currentOptions.maxTypeScale = parseFloat(maxTypeScaleSlider.value);

    // Update displayed values
    minFontSizeValue.textContent = minFontSizeSlider.value;
    maxFontSizeValue.textContent = maxFontSizeSlider.value;
    minTypeScaleValue.textContent = minTypeScaleSlider.value;
    maxTypeScaleValue.textContent = maxTypeScaleSlider.value;
    contentWidthValue.textContent = contentWidthSlider.value;

    // Recalculate and apply font steps
    updateFontSteps();
  }

  // Function to handle slider changes
  function handleContentWidthChange() {
    const sliderValue = parseInt(contentWidthSlider.value, 10);
    contentWidthValue.textContent = sliderValue;
    const remValue = sliderValue / 16 + "rem";
    // Select all elements with the class 'page-layout'
    const pageLayoutElements = document.querySelectorAll(".page-layout");
    const fullWidthElements = document.querySelectorAll(".full-width");

    // Apply the CSS variable to the root for global effect
    document.documentElement.style.setProperty("--content-max-width", remValue);

    // Optionally, also apply it to the specific elements
    pageLayoutElements.forEach((element) => {
      element.style.setProperty("--content-max-width", remValue);
    });
    fullWidthElements.forEach((element) => {
      element.style.setProperty("--content-max-width", remValue);
    });
  }

  // Function to handle slider changes
  function handleLineHeightChange() {
    const sliderValue = lineHeightSlider.value;
    lineHeightValue.textContent = sliderValue;

    // Select all elements with the class 'page-layout'
    const pageLayoutElements = document.querySelectorAll(".page-layout");
    const fullWidthElements = document.querySelectorAll(".full-width");

    // Apply the CSS variable to each 'page-layout' element
    pageLayoutElements.forEach((element) => {
      element.style.setProperty("--line-height", sliderValue);
    });
    fullWidthElements.forEach((element) => {
      element.style.setProperty("--line-height", sliderValue);
    });
  }

  // Add an event listener to handle input changes on the slider
  contentWidthSlider.addEventListener("input", handleContentWidthChange);
  lineHeightSlider.addEventListener("input", handleLineHeightChange);

  // Add event listeners to sliders
  minFontSizeSlider.addEventListener("input", handleSliderChange);
  maxFontSizeSlider.addEventListener("input", handleSliderChange);
  minTypeScaleSlider.addEventListener("input", handleSliderChange);
  maxTypeScaleSlider.addEventListener("input", handleSliderChange);

  // Initial setup
  handleSliderChange();
  // Initialize the CSS variable and display with the slider's initial value
  handleContentWidthChange();
});
