document.addEventListener("DOMContentLoaded", async () => {
  const API_KEY = "AIzaSyA-9_V4skPfwKR4Yoe39cfNByMklvvZUtM";
  const headlineFontSelect = document.getElementById("headline-font-selector");
  const bodyFontSelect = document.getElementById("body-font-selector");
  const fontUploadInput = document.getElementById("font-upload");

  function addFontOptionToSelects(fontName) {
    const existingOptions = [...headlineFontSelect.options].map((opt) =>
      opt.value.toLowerCase(),
    );
    if (existingOptions.includes(fontName.toLowerCase())) return;

    [headlineFontSelect, bodyFontSelect].forEach((select) => {
      const option = document.createElement("option");
      option.value = fontName;
      option.textContent = fontName;
      option.style.fontFamily = `'${fontName}'`;
      select.appendChild(option);
    });
  }

  function loadCustomFontsFromLocalStorage() {
    const savedFonts = JSON.parse(localStorage.getItem("customFonts") || "[]");

    savedFonts.forEach((font) => {
      const style = document.createElement("style");
      style.innerHTML = `
        @font-face {
          font-family: '${font.name}';
          src: url('${font.dataUrl}');
        }
      `;
      document.head.appendChild(style);
      addFontOptionToSelects(font.name);
    });
  }

  fontUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fontName = file.name.split(".")[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const fontDataUrl = event.target.result;

      const savedFonts = JSON.parse(
        localStorage.getItem("customFonts") || "[]",
      );
      if (
        savedFonts.some((f) => f.name.toLowerCase() === fontName.toLowerCase())
      ) {
        alert(`Font "${fontName}" is al toegevoegd.`);
        return;
      }

      const style = document.createElement("style");
      style.innerHTML = `
        @font-face {
          font-family: '${fontName}';
          src: url('${fontDataUrl}');
        }
      `;
      document.head.appendChild(style);

      addFontOptionToSelects(fontName);

      // Opslaan in localStorage
      savedFonts.push({ name: fontName, dataUrl: fontDataUrl });
      localStorage.setItem("customFonts", JSON.stringify(savedFonts));

      // Automatisch toepassen op headline
      headlineFontSelect.value = fontName;
      document.documentElement.style.setProperty(
        "--font-headline",
        `'${fontName}'`,
      );
      saveSelectedFonts(fontName, bodyFontSelect.value);
    };

    reader.readAsDataURL(file);
  });

  function saveSelectedFonts(headlineFont, bodyFont) {
    const selected = {
      headline: headlineFont || headlineFontSelect.value,
      body: bodyFont || bodyFontSelect.value,
    };
    localStorage.setItem("selectedFonts", JSON.stringify(selected));
  }

  function restoreSelectedFonts() {
    const saved = JSON.parse(localStorage.getItem("selectedFonts") || "{}");
    if (saved.headline) {
      headlineFontSelect.value = saved.headline;
      document.documentElement.style.setProperty(
        "--font-headline",
        `'${saved.headline}'`,
      );
      loadGoogleFont(saved.headline);
    }
    if (saved.body) {
      bodyFontSelect.value = saved.body;
      document.documentElement.style.setProperty(
        "--font-body",
        `'${saved.body}'`,
      );
      loadGoogleFont(saved.body);
    }
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`,
    );
    const data = await res.json();

    const limitedFonts = data.items.slice(0, 100);
    const sortedFonts = limitedFonts.sort((a, b) =>
      a.family.localeCompare(b.family),
    );

    sortedFonts.forEach((font) => {
      addFontOptionToSelects(font.family);
    });

    headlineFontSelect.addEventListener("change", () => {
      const selectedFont = headlineFontSelect.value;
      loadGoogleFont(selectedFont);
      document.documentElement.style.setProperty(
        "--font-headline",
        `'${selectedFont}', sans-serif`,
      );
      saveSelectedFonts(selectedFont, bodyFontSelect.value);
    });

    bodyFontSelect.addEventListener("change", () => {
      const selectedFont = bodyFontSelect.value;
      loadGoogleFont(selectedFont);
      document.documentElement.style.setProperty(
        "--font-body",
        `'${selectedFont}', sans-serif`,
      );
      saveSelectedFonts(headlineFontSelect.value, selectedFont);
    });
  } catch (error) {
    console.error("Error fetching fonts:", error);
  }

  function loadGoogleFont(font) {
    if (document.querySelector(`link[data-font="${font}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
      / /g,
      "+",
    )}&display=swap`;
    link.setAttribute("data-font", font);
    document.head.appendChild(link);
  }

  loadCustomFontsFromLocalStorage();
  restoreSelectedFonts();
});
