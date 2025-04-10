const typeControlPanelButton = document.querySelector(
  ".type-control-panel__button",
);

typeControlPanelButton.addEventListener("click", () => {
  const isExpanded =
    typeControlPanelButton.getAttribute("aria-expanded") === "true";
  typeControlPanelButton.setAttribute("aria-expanded", String(!isExpanded));
});
