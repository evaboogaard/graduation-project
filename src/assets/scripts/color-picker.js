const colors = [
  { id: "headline", cssVar: "--color-headline" },
  { id: "details", cssVar: "--color-details" },
  { id: "body", cssVar: "--color-body" },
  { id: "background", cssVar: "--color-background" },
  { id: "hover-bg", cssVar: "--color-btn-hover-bg" },
];

function updateCSSVariable(varName, value) {
  document.documentElement.style.setProperty(varName, value);
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((h) => h + h)
      .join("");
  }
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function getLuminance({ r, g, b }) {
  const toLinear = (c) =>
    (c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function updateTextColor(input, hex) {
  const rgb = hexToRgb(hex);
  const lum = getLuminance(rgb);
  input.style.color = lum > 0.5 ? "black" : "white";
  input.style.backgroundColor = hex;
}

function setupColorSync(colorInputId, hexInputId) {
  const colorInput = document.getElementById(colorInputId);
  const hexInput = document.getElementById(hexInputId);

  const sync = (hex) => {
    hexInput.value = hex;
    colorInput.value = hex;
    updateTextColor(hexInput, hex);
  };

  colorInput.addEventListener("input", () => sync(colorInput.value));
  hexInput.addEventListener("input", () => {
    const hex = hexInput.value;
    if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
      sync(hex.startsWith("#") ? hex : `#${hex}`);
    }
  });

  sync(colorInput.value);
}

colors.forEach(({ id, cssVar }) => {
  const colorInput = document.getElementById(`${id}-color`);
  const hexInput = document.getElementById(`${id}-hex`);
  const value =
    getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim() || "#000000";
  colorInput.value = value;
  hexInput.value = value;
  colorInput.addEventListener("input", () => {
    hexInput.value = colorInput.value;
    updateCSSVariable(cssVar, colorInput.value);
  });
  hexInput.addEventListener("input", () => {
    const val = hexInput.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      colorInput.value = val;
      updateCSSVariable(cssVar, val);
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  setupColorSync("headline-color", "headline-hex");
  setupColorSync("details-color", "details-hex");
  setupColorSync("body-color", "body-hex");
  setupColorSync("background-color", "background-hex");
  setupColorSync("hover-bg-color", "hover-bg-hex");
});
