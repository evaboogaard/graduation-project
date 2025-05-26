function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function showContrastWarning(textId, ratio) {
  const warningEls = document.querySelectorAll(`.${textId}-warning`);
  if (!warningEls.length) return;

  const meetsStandard = ratio >= 4.5;

  warningEls.forEach((warningEl) => {
    warningEl.innerHTML = "";

    if (!meetsStandard) {
      const iconSpan = document.createElement("span");
      iconSpan.className = "warning-icon";
      iconSpan.textContent = "⚠️";

      const textSpan = document.createElement("span");
      textSpan.className = "warning-text";
      textSpan.textContent = ` ${ratio.toFixed(2)}:1`;

      warningEl.appendChild(iconSpan);
      warningEl.appendChild(textSpan);

      const bgHex = document.getElementById("btn-default-bg-color").value;
      updateTextColor(warningEl, bgHex, true);
    }
  });
}

function checkAllContrasts() {
  const bg = hexToRgb(document.getElementById("background-color").value);
  ["headline", "body"].forEach((id) => {
    const fg = hexToRgb(document.getElementById(`${id}-color`).value);
    const ratio = getContrastRatio(fg, bg);
    showContrastWarning(id, ratio);
  });

  const btnBg = hexToRgb(document.getElementById("btn-default-bg-color").value);
  const btnText = hexToRgb(
    document.getElementById("btn-default-text-color").value,
  );
  const btnRatio = getContrastRatio(btnText, btnBg);
  showContrastWarning("btn-default", btnRatio);
}

const colors = [
  { id: "headline", cssVar: "--color-headline" },
  { id: "details", cssVar: "--color-details" },
  { id: "body", cssVar: "--color-body" },
  { id: "background", cssVar: "--color-background" },
  { id: "btn-default-bg", cssVar: "--color-btn-default-bg" },
  { id: "btn-default-text", cssVar: "--color-btn-default-text" },
  { id: "btn-hover-bg", cssVar: "--color-btn-hover-bg" },
  { id: "btn-hover-text", cssVar: "--color-btn-hover-text" },
  { id: "btn-focus-outline", cssVar: "--color-btn-focus-outline" },
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

function updateTextColor(input, hex, skipBg = false) {
  const rgb = hexToRgb(hex);
  const lum = getLuminance(rgb);
  input.style.color = lum > 0.5 ? "black" : "white";
  if (!skipBg) {
    input.style.backgroundColor = hex;
  }
}

function setupColorSync(colorInputId, hexInputId) {
  const colorInput = document.getElementById(colorInputId);
  const hexInput = document.getElementById(hexInputId);
  const cssVar = colorInput.dataset.cssVar;
  const key = `${colorInputId}-value`;

  const sync = (hex) => {
    hexInput.value = hex;
    colorInput.value = hex;
    updateTextColor(hexInput, hex);
    updateCSSVariable(cssVar, hex);
    localStorage.setItem(key, hex);
    checkAllContrasts();
  };

  colorInput.addEventListener("input", () => sync(colorInput.value));
  hexInput.addEventListener("input", () => {
    const hex = hexInput.value;
    if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
      sync(hex.startsWith("#") ? hex : `#${hex}`);
    }
  });

  const saved = localStorage.getItem(key);
  if (saved) {
    sync(saved);
  } else {
    sync(colorInput.value);
  }
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
  colorInput.dataset.cssVar = cssVar;
});

window.addEventListener("DOMContentLoaded", () => {
  setupColorSync("headline-color", "headline-hex");
  setupColorSync("details-color", "details-hex");
  setupColorSync("body-color", "body-hex");
  setupColorSync("background-color", "background-hex");
  setupColorSync("btn-default-bg-color", "btn-default-bg-hex");
  setupColorSync("btn-default-text-color", "btn-default-text-hex");
  setupColorSync("btn-hover-bg-color", "btn-hover-bg-hex");
  setupColorSync("btn-hover-text-color", "btn-hover-text-hex");
  setupColorSync("btn-focus-outline-color", "btn-focus-outline-hex");
});
