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
      const wrapper = document.createElement("div");
      wrapper.className = "warning-wrapper";

      const icon = document.createElement("span");
      icon.className = "warning-icon";
      icon.textContent = "⚠️";

      const popover = document.createElement("div");
      popover.className = "warning-popover";
      popover.textContent = `This doesn’t meet the minimum WCAG contrast guidelines. Please improve your contrast. It has to be at least 4.5:1, currently it is ${ratio.toFixed(
        2,
      )}:1.`;

      wrapper.appendChild(icon);
      wrapper.appendChild(popover);
      warningEl.appendChild(wrapper);

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

  const secondaryBg = hexToRgb(
    document.getElementById("secondary-background-color").value,
  );
  const secondaryText = hexToRgb(
    document.getElementById("secondary-text-color").value,
  );
  const secondaryRatio = getContrastRatio(secondaryText, secondaryBg);
  showContrastWarning("secondary-text", secondaryRatio);

  const btnBg = hexToRgb(document.getElementById("btn-default-bg-color").value);
  const btnText = hexToRgb(
    document.getElementById("btn-default-text-color").value,
  );
  const btnRatio = getContrastRatio(btnText, btnBg);
  showContrastWarning("btn-default", btnRatio);

  const btnHoverBg = hexToRgb(
    document.getElementById("btn-hover-bg-color").value,
  );
  const btnHoverText = hexToRgb(
    document.getElementById("btn-hover-text-color").value,
  );
  const btnHoverRatio = getContrastRatio(btnHoverText, btnHoverBg);
  showContrastWarning("btn-hover", btnHoverRatio);

  const copyButton = document.getElementById("copyCSSButton");
  if (!copyButton) return;

  const hasWarnings = document.querySelectorAll(".warning-icon").length > 0;
  let warningMessage = document.getElementById("copy-warning");

  if (hasWarnings) {
    copyButton.disabled = true;
    if (!warningMessage) {
      warningMessage = document.createElement("p");
      warningMessage.id = "copy-warning";
      warningMessage.textContent =
        "Want your CSS? Earn it. Fix the color contrasts and you can continue.";
      copyButton.insertAdjacentElement("afterend", warningMessage);
    }
  } else {
    copyButton.disabled = false;
    if (warningMessage) {
      warningMessage.remove();
    }
  }
}

const colors = [
  { id: "headline", cssVar: "--color-headline" },
  { id: "secondary-background", cssVar: "--color-secondary-background" },
  { id: "secondary-text", cssVar: "--color-secondary-text" },
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
  const targetId = colorInputId.replace("-color", "");
  const targetEl =
    document.querySelector(`.${targetId}`) || document.getElementById(targetId);

  const excludeFromStorage = new Set([
    "headline-color",
    "secondary-background-color",
    "body-color",
    "background-color",
  ]);

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
    if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      sync(hex.startsWith("#") ? hex : `#${hex}`);
    }
  });
  if (targetEl) {
    colorInput.addEventListener("focus", () => {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
  const saved = !excludeFromStorage.has(colorInputId)
    ? localStorage.getItem(key)
    : null;

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
  setupColorSync("secondary-background-color", "secondary-background-hex");
  setupColorSync("secondary-text-color", "secondary-text-hex");
  setupColorSync("body-color", "body-hex");
  setupColorSync("background-color", "background-hex");
  setupColorSync("btn-default-bg-color", "btn-default-bg-hex");
  setupColorSync("btn-default-text-color", "btn-default-text-hex");
  setupColorSync("btn-hover-bg-color", "btn-hover-bg-hex");
  setupColorSync("btn-hover-text-color", "btn-hover-text-hex");
  setupColorSync("btn-focus-outline-color", "btn-focus-outline-hex");
});

function getRandomHexColor() {
  const rand = () => Math.floor(Math.random() * 256);
  const r = rand();
  const g = rand();
  const b = rand();
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function generateAccessiblePalette() {
  let bg, headline, body, details;
  let contrastHeadline, contrastBody;
  do {
    bg = getRandomHexColor();
    headline = getRandomHexColor();
    body = getRandomHexColor();
    details = getRandomHexColor();
    contrastHeadline = getContrastRatio(hexToRgb(headline), hexToRgb(bg));
    contrastBody = getContrastRatio(hexToRgb(body), hexToRgb(bg));
  } while (contrastHeadline < 4.5 || contrastBody < 4.5);
  return { headline, body, background: bg, details };
}

function applyRandomColors() {
  const { headline, body, background, details } = generateAccessiblePalette();
  const palette = { headline, body, background, details };
  Object.entries(palette).forEach(([id, hex]) => {
    const colorInput = document.getElementById(`${id}-color`);
    const hexInput = document.getElementById(`${id}-hex`);
    hexInput.value = hex;
    colorInput.value = hex;
    hexInput.dispatchEvent(new Event("input"));
  });
}

document
  .getElementById("refresh-colors")
  .addEventListener("click", applyRandomColors);

export function getColorCSSVariables() {
  const vars = [];

  const ids = [
    "background-color",
    "headline-color",
    "body-color",
    "btn-default-bg-color",
    "btn-default-text-color",
    "btn-hover-bg-color",
    "btn-hover-text-color",
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      const name = `--${id}`;
      const value = el.value;
      vars.push(`  ${name}: ${value};`);
    }
  });

  return vars.join("\n");
}
