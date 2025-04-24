const colors = [
  { id: "primary", cssVar: "--color-primary" },
  { id: "secondary", cssVar: "--color-secondary" },
  { id: "body", cssVar: "--color-body" },
  { id: "background", cssVar: "--color-background" },
];

colors.forEach(({ id, cssVar }) => {
  const colorInput = document.getElementById(`${id}-color`);
  const hexInput = document.getElementById(`${id}-hex`);

  // Init: haal waarde op uit CSS variable
  const initialValue =
    getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim() || "#000000";
  colorInput.value = initialValue;
  hexInput.value = initialValue;

  // color → hex
  colorInput.addEventListener("input", () => {
    hexInput.value = colorInput.value;
    updateCSSVariable(cssVar, colorInput.value);
  });

  // hex → color
  hexInput.addEventListener("input", () => {
    const val = hexInput.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      colorInput.value = val;
      updateCSSVariable(cssVar, val);
    }
  });
});

function updateCSSVariable(varName, value) {
  document.documentElement.style.setProperty(varName, value);
}
