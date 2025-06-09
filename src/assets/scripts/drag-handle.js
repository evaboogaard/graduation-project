const pageGrid = document.querySelector(".page-grid");
const dragHandle = document.querySelector(".drag-handle");
const mainControlPanelButton = document.querySelector(
  ".main-control-panel__button",
);
const smallTypographyPanelButton = document.querySelector(
  ".small-typography-panel__button",
);

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

  const dragHandleWidth = 5; // in px
  const minLeftWidth = 100; // in px
  const maxLeftWidth = gridRect.width - 100 - dragHandleWidth;

  if (offsetX < minLeftWidth) offsetX = minLeftWidth;
  if (offsetX > maxLeftWidth) offsetX = maxLeftWidth;

  const leftWidth = offsetX;
  const rightWidth = gridRect.width - leftWidth - dragHandleWidth;
  const totalFlexibleWidth = leftWidth + rightWidth;

  const leftFr = leftWidth / totalFlexibleWidth;
  const rightFr = rightWidth / totalFlexibleWidth;

  pageGrid.style.gridTemplateColumns = `${leftFr}fr ${pxToRem(
    dragHandleWidth,
  )}rem ${rightFr}fr`;

  if (
    rightWidth > 50 &&
    mainControlPanelButton.getAttribute("aria-expanded") === "false"
  ) {
    mainControlPanelButton.setAttribute("aria-expanded", "true");
  }
});

// Button click toggle aria-expanded en zet rechter kolom breedte naar 50px als 'dicht'
mainControlPanelButton.addEventListener("click", () => {
  const expanded =
    mainControlPanelButton.getAttribute("aria-expanded") === "true";

  const gridRect = pageGrid.getBoundingClientRect();

  if (expanded) {
    // Paneel inklappen
    mainControlPanelButton.setAttribute("aria-expanded", "false");
    const leftWidth = gridRect.width - 50 - 5; // 5px drag handle
    pageGrid.style.gridTemplateColumns = `${pxToRem(
      leftWidth,
    )}rem 0.3125rem 3.125rem`; // 50px = 3.125rem
  } else {
    // Paneel uitklappen
    mainControlPanelButton.setAttribute("aria-expanded", "true");
    const rightWidth = 450; // 450px
    const leftWidth = gridRect.width - rightWidth - 5;
    pageGrid.style.gridTemplateColumns = `${pxToRem(
      leftWidth,
    )}rem 0.3125rem ${pxToRem(rightWidth)}rem`;
  }
});

smallTypographyPanelButton.addEventListener("click", () => {
  const parentPanel = smallTypographyPanelButton.closest(
    ".small-typography-panel",
  );
  const isExpanded = parentPanel.getAttribute("aria-expanded") === "true";
  parentPanel.setAttribute("aria-expanded", String(!isExpanded));
});
