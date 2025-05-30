const pageGrid = document.querySelector(".page-grid");
const dragHandle = document.querySelector(".drag-handle");
const toggleButton = document.querySelector(".main-control-panel__button");

const pxToRem = (px) => px / 16;

let isDragging = false;

dragHandle.addEventListener("mousedown", () => {
  isDragging = true;
  document.body.style.userSelect = "none"; // voorkomen selecteren buiten grid
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.userSelect = "";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const gridRect = pageGrid.getBoundingClientRect();
  let offsetX = e.clientX - gridRect.left;

  const minLeftWidth = 100; // in px
  const maxLeftWidth = gridRect.width - 100 - 5; // 5px drag handle breedte

  if (offsetX < minLeftWidth) offsetX = minLeftWidth;
  if (offsetX > maxLeftWidth) offsetX = maxLeftWidth;

  const rightWidth = gridRect.width - offsetX - 5;

  // Omzetten naar rem voor styling
  pageGrid.style.gridTemplateColumns = `${pxToRem(
    offsetX,
  )}rem 0.3125rem ${pxToRem(rightWidth)}rem`;
  // 5px = 0.3125rem

  // Als rechter kolom breder is dan 50px en aria-expanded is false, zet aria-expanded op true
  if (
    rightWidth > 50 &&
    toggleButton.getAttribute("aria-expanded") === "false"
  ) {
    toggleButton.setAttribute("aria-expanded", "true");
  }
});

// Button click toggle aria-expanded en zet rechter kolom breedte naar 50px als 'dicht'
toggleButton.addEventListener("click", () => {
  const expanded = toggleButton.getAttribute("aria-expanded") === "true";

  const gridRect = pageGrid.getBoundingClientRect();

  if (expanded) {
    // Paneel inklappen
    toggleButton.setAttribute("aria-expanded", "false");
    const leftWidth = gridRect.width - 50 - 5; // 5px drag handle
    pageGrid.style.gridTemplateColumns = `${pxToRem(
      leftWidth,
    )}rem 0.3125rem 3.125rem`; // 50px = 3.125rem
  } else {
    // Paneel uitklappen
    toggleButton.setAttribute("aria-expanded", "true");
    const rightWidth = 450; // 450px
    const leftWidth = gridRect.width - rightWidth - 5;
    pageGrid.style.gridTemplateColumns = `${pxToRem(
      leftWidth,
    )}rem 0.3125rem ${pxToRem(rightWidth)}rem`;
  }
});
