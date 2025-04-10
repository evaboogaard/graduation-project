const mainControlPanelButton = document.querySelector(
  ".main-control-panel__button",
);

mainControlPanelButton.addEventListener("click", () => {
  const isExpanded =
    mainControlPanelButton.getAttribute("aria-expanded") === "true";
  mainControlPanelButton.setAttribute("aria-expanded", String(!isExpanded));
});
