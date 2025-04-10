const gridDebugger = document.getElementById("grid-debugger");
const gridTypeSelectorButton = document.querySelector(
  ".grid-type-selector__button",
);

gridTypeSelectorButton.addEventListener("click", () => {
  gridDebugger.classList.toggle("visible");
});

function resizeGridOverlay() {
  const grid = document.querySelector(".grid-grid-lines");
  grid.style.height = `${document.documentElement.scrollHeight}px`;
}

resizeGridOverlay();

window.addEventListener("resize", resizeGridOverlay);
