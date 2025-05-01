document.addEventListener("DOMContentLoaded", () => {
  const btnRadius = document.getElementById("btnRadius");
  const btnPaddingBlock = document.getElementById("btnPaddingBlock");
  const btnPaddingInline = document.getElementById("btnPaddingInline");

  // Select the root or button element to apply CSS variables to
  const root = document.documentElement;

  // Apply the changes when the user interacts with the form

  btnRadius.addEventListener("input", (event) => {
    root.style.setProperty("--btn-radius", `${event.target.value}rem`);
  });

  btnPaddingBlock.addEventListener("input", (event) => {
    root.style.setProperty("--btn-padding-block", `${event.target.value}rem`);
  });

  btnPaddingInline.addEventListener("input", (event) => {
    root.style.setProperty("--btn-padding-inline", `${event.target.value}rem`);
  });
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

  // Limiteer binnen de drag area
  offsetX = Math.max(Math.min(offsetX, maxOffset), -maxOffset);
  offsetY = Math.max(Math.min(offsetY, maxOffset), -maxOffset);

  // Verplaats het handvat
  handle.style.transform = `translate(calc(${offsetX}px - 50%), calc(${offsetY}px - 50%))`;

  // Omgerekend naar rems
  const xRem = (offsetX / maxOffset).toFixed(2);
  const yRem = (offsetY / maxOffset).toFixed(2);

  const transformValue = `translate(${xRem}rem, ${yRem}rem)`;

  // Update de CSS variabele in :root
  document.documentElement.style.setProperty(
    "--btn-hover-transform",
    transformValue,
  );
});
