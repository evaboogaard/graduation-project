// h1-1

document.addEventListener("DOMContentLoaded", () => {
  const h1_1Radios = document.querySelectorAll('input[name="h1-1-type-scale"]');
  const h1_1TargetLink = document.querySelector('a[href="#h1-1"]');
  const editableCheckbox = document.getElementById("h1-1-contenteditable");

  h1_1Radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        const step = radio.id;
        h1_1TargetLink.style.fontSize = `var(--${step})`;
      }
    });
  });

  h1_1TargetLink.addEventListener("click", (e) => {
    if (h1_1TargetLink.isContentEditable) {
      e.preventDefault();
    }
  });

  editableCheckbox.addEventListener("change", () => {
    const isEditing = editableCheckbox.checked;
    h1_1TargetLink.contentEditable = isEditing;

    // Optioneel: visuele hint toevoegen tijdens edit-modus
    if (isEditing) {
      h1_1TargetLink.classList.add("is-editing");
    } else {
      h1_1TargetLink.classList.remove("is-editing");
    }
  });
});

const h1_1Slider = document.getElementById("lineHeightH1-1");
const h1_1ValueDisplay = document.getElementById("lineHeightH1-1Value");

function updateLineHeight() {
  const value = h1_1Slider.value;
  h1_1ValueDisplay.textContent = value;
  document.documentElement.style.setProperty("--line-height-h1-1", value);
}

// Initieel instellen bij paginalaad
updateLineHeight();

// Bij verandering live updaten
h1_1Slider.addEventListener("input", updateLineHeight);
