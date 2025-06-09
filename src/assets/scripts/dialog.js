const dialog = document.getElementById("info-dialog");
const openBtn = document.querySelector(".dialog-btn");
const closeBtn = dialog.querySelector(".dialog-close");

openBtn.addEventListener("click", () => {
  dialog.showModal(); // opent met backdrop
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (e) => {
  const dialogRect = dialog.getBoundingClientRect();
  const clickedInDialog =
    e.clientX >= dialogRect.left &&
    e.clientX <= dialogRect.right &&
    e.clientY >= dialogRect.top &&
    e.clientY <= dialogRect.bottom;

  if (!clickedInDialog) {
    dialog.close();
  }
});
