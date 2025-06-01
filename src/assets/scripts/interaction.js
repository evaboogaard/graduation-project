document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  const btnDefaultRadius = document.getElementById("btnDefaultRadius");
  const btnDefaultPaddingBlock = document.getElementById(
    "btnDefaultPaddingBlock",
  );
  const btnDefaultPaddingInline = document.getElementById(
    "btnDefaultPaddingInline",
  );

  const btnBorderRadiusValue = document.getElementById("btnBorderRadiusValue");
  const btnPaddingBlockValue = document.getElementById("btnPaddingBlockValue");
  const btnPaddingInlineValue = document.getElementById(
    "btnPaddingInlineValue",
  );

  const borderThicknessInput = document.getElementById(
    "btnFocusBorderThickness",
  );
  const borderOffsetInput = document.getElementById("btnFocusBorderOffset");
  const borderStyleSelect = document.getElementById("btn-border-style");
  const borderColorInput = document.getElementById("btn-focus-outline-color");

  const borderThicknessValue = document.getElementById(
    "btnFocusBorderThicknessValue",
  );
  const borderOffsetValue = document.getElementById(
    "btnFocusBorderOffsetValue",
  );

  const remToPx = (rem) => {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    return (rem * rootFontSize).toFixed(0);
  };

  function updateValue(input, cssVarName, outputSpan) {
    const remValue = parseFloat(input.value);
    const pxValue = remToPx(remValue);
    root.style.setProperty(cssVarName, `${remValue}rem`);
    outputSpan.textContent = `${pxValue}px`;
    localStorage.setItem(cssVarName, remValue);
  }

  function restoreValue(input, cssVarName, outputSpan) {
    const savedValue = localStorage.getItem(cssVarName);
    const valueToUse = savedValue !== null ? savedValue : input.value;
    input.value = valueToUse;
    updateValue(input, cssVarName, outputSpan);
  }

  // Restore btn default inputs with px update
  restoreValue(btnDefaultRadius, "--btn-radius", btnBorderRadiusValue);
  restoreValue(
    btnDefaultPaddingBlock,
    "--btn-padding-block",
    btnPaddingBlockValue,
  );
  restoreValue(
    btnDefaultPaddingInline,
    "--btn-padding-inline",
    btnPaddingInlineValue,
  );

  btnDefaultRadius.addEventListener("input", () =>
    updateValue(btnDefaultRadius, "--btn-radius", btnBorderRadiusValue),
  );

  btnDefaultPaddingBlock.addEventListener("input", () =>
    updateValue(
      btnDefaultPaddingBlock,
      "--btn-padding-block",
      btnPaddingBlockValue,
    ),
  );

  btnDefaultPaddingInline.addEventListener("input", () =>
    updateValue(
      btnDefaultPaddingInline,
      "--btn-padding-inline",
      btnPaddingInlineValue,
    ),
  );

  borderThicknessInput.addEventListener("input", () => {
    const px = `${borderThicknessInput.value}px`;
    root.style.setProperty("--btn-focus-outline-thickness", px);
    borderThicknessValue.textContent = px;
    localStorage.setItem(
      "--btn-focus-outline-thickness",
      borderThicknessInput.value,
    );
  });

  borderOffsetInput.addEventListener("input", () => {
    const px = `${borderOffsetInput.value}px`;
    root.style.setProperty("--btn-focus-outline-offset", px);
    borderOffsetValue.textContent = px;
    localStorage.setItem("--btn-focus-outline-offset", borderOffsetInput.value);
  });

  borderStyleSelect.addEventListener("change", () => {
    root.style.setProperty(
      "--btn-focus-outline-style",
      borderStyleSelect.value,
    );
    localStorage.setItem("--btn-focus-outline-style", borderStyleSelect.value);
  });

  borderColorInput.addEventListener("input", () => {
    root.style.setProperty("--btn-focus-outline-color", borderColorInput.value);
    localStorage.setItem("--btn-focus-outline-color", borderColorInput.value);
  });

  // Restore border thickness/offset/style/color inputs values and update UI
  const savedThickness = localStorage.getItem("--btn-focus-outline-thickness");
  if (savedThickness !== null) borderThicknessInput.value = savedThickness;

  const savedOffset = localStorage.getItem("--btn-focus-outline-offset");
  if (savedOffset !== null) borderOffsetInput.value = savedOffset;

  const savedStyle = localStorage.getItem("--btn-focus-outline-style");
  if (savedStyle !== null) borderStyleSelect.value = savedStyle;

  const savedColor = localStorage.getItem("--btn-focus-outline-color");
  if (savedColor !== null) borderColorInput.value = savedColor;

  borderThicknessInput.dispatchEvent(new Event("input"));
  borderOffsetInput.dispatchEvent(new Event("input"));
  borderStyleSelect.dispatchEvent(new Event("change"));
  borderColorInput.dispatchEvent(new Event("input"));
});

const dragArea = document.querySelector(".drag-area");
const handle = document.querySelector(".drag-handle");
const output = document.getElementById("output");

let isDragging = false;

dragArea.addEventListener("mousedown", (e) => {
  isDragging = true;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const rect = dragArea.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let offsetX = e.clientX - centerX;
  let offsetY = e.clientY - centerY;

  const maxOffset = rect.width / 2;

  offsetX = Math.max(Math.min(offsetX, maxOffset), -maxOffset);
  offsetY = Math.max(Math.min(offsetY, maxOffset), -maxOffset);

  handle.style.transform = `translate(calc(${offsetX}px - 50%), calc(${offsetY}px - 50%))`;

  const xRem = (offsetX / maxOffset).toFixed(2);
  const yRem = (offsetY / maxOffset).toFixed(2);

  const transformValue = `translate(${xRem}rem, ${yRem}rem)`;

  document.documentElement.style.setProperty(
    "--btn-hover-transform",
    transformValue,
  );
  localStorage.setItem("--btn-hover-transform", transformValue);
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTransform = localStorage.getItem("--btn-hover-transform");
  if (savedTransform) {
    document.documentElement.style.setProperty(
      "--btn-hover-transform",
      savedTransform,
    );
    const match = savedTransform.match(
      /translate\((-?[\d.]+)rem,\s*(-?[\d.]+)rem\)/,
    );
    if (match) {
      const [_, xRem, yRem] = match;
      const dragWidth = dragArea.getBoundingClientRect().width;
      const maxOffset = dragWidth / 2;
      const offsetX = (parseFloat(xRem) * maxOffset).toFixed(0);
      const offsetY = (parseFloat(yRem) * maxOffset).toFixed(0);
      handle.style.transform = `translate(calc(${offsetX}px - 50%), calc(${offsetY}px - 50%))`;
    }
  }
});

export function getButtonCSSVariables() {
  const computed = getComputedStyle(document.documentElement);

  return {
    "--btn-radius": computed.getPropertyValue("--btn-radius").trim(),
    "--btn-padding-block": computed
      .getPropertyValue("--btn-padding-block")
      .trim(),
    "--btn-padding-inline": computed
      .getPropertyValue("--btn-padding-inline")
      .trim(),
    "--btn-focus-outline-thickness": computed
      .getPropertyValue("--btn-focus-outline-thickness")
      .trim(),
    "--btn-focus-outline-offset": computed
      .getPropertyValue("--btn-focus-outline-offset")
      .trim(),
    "--btn-focus-outline-style": computed
      .getPropertyValue("--btn-focus-outline-style")
      .trim(),
    "--btn-focus-outline-color": computed
      .getPropertyValue("--btn-focus-outline-color")
      .trim(),
  };
}
