document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(
      '[id^="quote-"], [id^="h1-"], [id^="p-"], [id^="h2-"], [id^="alert-"], [id^="double-column-"], [id^="email"]',
    )
    .forEach((container) => {
      const id = container.id;
      const radios = container.querySelectorAll(
        `input[name="${id}-type-scale"]`,
      );
      const targetLink = document.querySelector(`a[href="#${id}"]`);
      const editableCheckbox = document.getElementById(`${id}-contenteditable`);
      const slider = document.getElementById(`lineHeight${id}`);
      const valueDisplay = document.getElementById(`lineHeight${id}Value`);

      // Set initial font size based on checked radio
      const checkedRadio = container.querySelector(
        `input[name="${id}-type-scale"]:checked`,
      );
      if (checkedRadio && targetLink) {
        const step = checkedRadio.id.replace(`${id}-`, "");
        targetLink.style.fontSize = `var(--${step})`;
      }

      // Update font size when radio changes
      radios.forEach((radio) => {
        radio.addEventListener("change", () => {
          if (radio.checked && targetLink) {
            const step = radio.id.replace(`${id}-`, "");
            targetLink.style.fontSize = `var(--${step})`;
          }
        });
      });

      // Toggle editable content
      if (editableCheckbox && targetLink) {
        editableCheckbox.addEventListener("change", () => {
          const isEditing = editableCheckbox.checked;
          targetLink.contentEditable = isEditing;
          targetLink.classList.toggle("is-editing", isEditing);
        });

        targetLink.addEventListener("click", (e) => {
          if (targetLink.isContentEditable) {
            e.preventDefault();
          }
        });

        document.addEventListener("click", (e) => {
          if (
            editableCheckbox.checked &&
            !targetLink.contains(e.target) &&
            e.target !== editableCheckbox
          ) {
            editableCheckbox.checked = false;
            targetLink.contentEditable = false;
            targetLink.classList.remove("is-editing");
          }
        });
      }

      // Update CSS variable for line-height on slider input
      if (slider && valueDisplay && targetLink) {
        function updateLineHeight() {
          const value = slider.value;
          valueDisplay.textContent = value;
          targetLink.style.setProperty(`--line-height-${id}`, value);
        }
        // updateLineHeight();
        slider.addEventListener("input", updateLineHeight);
      }
    });
});
