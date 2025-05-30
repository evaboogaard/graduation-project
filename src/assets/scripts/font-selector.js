import { updateUrl } from "./url-params.js";

function markFontAsLoaded(font) {
  const loadedFonts = JSON.parse(
    localStorage.getItem("loadedGoogleFonts") || "[]",
  );
  if (!loadedFonts.includes(font)) {
    loadedFonts.push(font);
    localStorage.setItem("loadedGoogleFonts", JSON.stringify(loadedFonts));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.createElement("div");
  loader.id = "font-loader";
  loader.textContent = "Loading fonts...";
  loader.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    z-index: 9999;
    font-size: 1.2rem;
    font-family: sans-serif;
  `;
  document.body.appendChild(loader);

  const API_KEY = "AIzaSyA-9_V4skPfwKR4Yoe39cfNByMklvvZUtM";
  const headlineFontSelect = document.getElementById("headline-font-selector");
  const bodyFontSelect = document.getElementById("body-font-selector");
  const headlineFontUpload = document.getElementById("headline-font-upload");
  const bodyFontUpload = document.getElementById("body-font-upload");

  let allFonts = [];

  function updateRecentFonts(type, fontName) {
    const key = `recentFonts_${type}`;
    let recent = JSON.parse(localStorage.getItem(key) || "[]");
    recent = recent.filter((f) => f !== fontName);
    recent.unshift(fontName);
    recent = recent.slice(0, 3);
    localStorage.setItem(key, JSON.stringify(recent));
  }

  async function loadFont(font) {
    if (document.querySelector(`link[data-font="${font}"]`)) return;
    const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(
      / /g,
      "+",
    )}&display=swap`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    link.setAttribute("data-font", font);
    document.head.appendChild(link);
    try {
      await document.fonts.load(`1rem '${font}'`);
      markFontAsLoaded(font);
    } catch {
      console.warn(`Font '${font}' failed to load.`);
    }
  }

  async function populateFontSelectWithRecentFonts(select, type) {
    const recentFonts = JSON.parse(
      localStorage.getItem(`recentFonts_${type}`) || "[]",
    );
    select.innerHTML = "";
    const createOption = (fontName) => {
      const option = document.createElement("option");
      option.value = fontName;
      option.textContent = fontName;
      option.style.fontFamily = `'${fontName}', sans-serif`;
      return option;
    };
    if (recentFonts.length) {
      const recentGroup = document.createElement("optgroup");
      recentGroup.label = "Recently used";
      for (const font of recentFonts) {
        await loadFont(font);
        recentGroup.appendChild(createOption(font));
      }
      select.appendChild(recentGroup);
    }
    const allGroup = document.createElement("optgroup");
    allGroup.label = "All fonts";
    for (const font of allFonts) {
      if (!recentFonts.includes(font)) {
        await loadFont(font);
        allGroup.appendChild(createOption(font));
      }
    }
    select.appendChild(allGroup);

    const savedFonts = JSON.parse(localStorage.getItem("customFonts") || "[]");
    if (savedFonts.length > 0) {
      const customGroup = document.createElement("optgroup");
      customGroup.label = "Uploaded fonts";
      for (const font of savedFonts) {
        const option = document.createElement("option");
        option.value = font.name;
        option.textContent = font.name;
        option.style.fontFamily = `'${font.name}'`;
        customGroup.appendChild(option);
      }
      select.appendChild(customGroup);
    }

    const uploadOption = document.createElement("option");
    uploadOption.value = "__upload__";
    uploadOption.textContent = "Upload custom font...";
    select.appendChild(uploadOption);
  }

  function addFontOptionToLists(fontName) {
    const lowerName = fontName.toLowerCase();
    const exists = [...headlineFontSelect.options].some(
      (opt) => opt.value.toLowerCase() === lowerName,
    );
    if (exists) return;
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
      style.textContent = `
        @font-face {
          font-family: '${font.name}';
          src: url('${font.dataUrl}');
        }
      `;
      document.head.appendChild(style);
      addFontOptionToLists(font.name);
    });
  }

  function handleFontUpload(file, target) {
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
      style.textContent = `
        @font-face {
          font-family: '${fontName}';
          src: url('${fontDataUrl}');
        }
      `;
      document.head.appendChild(style);
      savedFonts.push({ name: fontName, dataUrl: fontDataUrl });
      localStorage.setItem("customFonts", JSON.stringify(savedFonts));
      addFontOptionToLists(fontName);
      if (target === "headline") {
        headlineFontSelect.value = fontName;
        document.documentElement.style.setProperty(
          "--font-headline",
          `'${fontName}'`,
        );
        updateRecentFonts("headline", fontName);
        saveSelectedFonts(fontName, bodyFontSelect.value);
      } else if (target === "body") {
        bodyFontSelect.value = fontName;
        document.documentElement.style.setProperty(
          "--font-body",
          `'${fontName}'`,
        );
        updateRecentFonts("body", fontName);
        saveSelectedFonts(headlineFontSelect.value, fontName);
      }
      populateFontSelectWithRecentFonts(headlineFontSelect, "headline");
      populateFontSelectWithRecentFonts(bodyFontSelect, "body");
    };
    reader.readAsDataURL(file);
  }

  headlineFontUpload.addEventListener("change", (e) =>
    handleFontUpload(e.target.files[0], "headline"),
  );
  bodyFontUpload.addEventListener("change", (e) =>
    handleFontUpload(e.target.files[0], "body"),
  );

  function saveSelectedFonts(headlineFont, bodyFont) {
    const selected = {
      headline: headlineFont || headlineFontSelect.value,
      body: bodyFont || bodyFontSelect.value,
    };
    localStorage.setItem("selectedFonts", JSON.stringify(selected));
  }

  async function restoreSelectedFonts() {
    const saved = JSON.parse(localStorage.getItem("selectedFonts") || "{}");
    if (saved.headline) {
      headlineFontSelect.value = saved.headline;
      document.documentElement.style.setProperty(
        "--font-headline",
        `'${saved.headline}'`,
      );
      await loadFont(saved.headline);
      updateRecentFonts("headline", saved.headline);
    }
    if (saved.body) {
      bodyFontSelect.value = saved.body;
      document.documentElement.style.setProperty(
        "--font-body",
        `'${saved.body}'`,
      );
      await loadFont(saved.body);
      updateRecentFonts("body", saved.body);
    }
  }

  headlineFontSelect.addEventListener("change", async () => {
    if (headlineFontSelect.value === "__upload__") {
      headlineFontUpload.click();
      headlineFontSelect.value = localStorage.getItem("selectedFonts")
        ? JSON.parse(localStorage.getItem("selectedFonts")).headline
        : allFonts[0] || "";
      return;
    }
    const selectedFont = headlineFontSelect.value;
    await loadFont(selectedFont);
    document.documentElement.style.setProperty(
      "--font-headline",
      `'${selectedFont}', sans-serif`,
    );
    updateRecentFonts("headline", selectedFont);
    saveSelectedFonts(selectedFont, bodyFontSelect.value);
    updateUrl();
    populateFontSelectWithRecentFonts(headlineFontSelect, "headline");
  });

  bodyFontSelect.addEventListener("change", async () => {
    if (bodyFontSelect.value === "__upload__") {
      bodyFontUpload.click();
      bodyFontSelect.value = localStorage.getItem("selectedFonts")
        ? JSON.parse(localStorage.getItem("selectedFonts")).body
        : allFonts[0] || "";
      return;
    }
    const selectedFont = bodyFontSelect.value;
    await loadFont(selectedFont);
    document.documentElement.style.setProperty(
      "--font-body",
      `'${selectedFont}', sans-serif`,
    );
    updateRecentFonts("body", selectedFont);
    saveSelectedFonts(headlineFontSelect.value, selectedFont);
    updateUrl();
    populateFontSelectWithRecentFonts(bodyFontSelect, "body");
  });

  try {
    const res = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`,
    );
    const data = await res.json();
    const filteredFonts = data.items.filter(
      (font) =>
        font.subsets.includes("latin") &&
        font.variants.includes("regular") &&
        !["display", "handwriting", "symbol", "icons"].includes(
          font.category,
        ) &&
        !font.family.toLowerCase().includes("material"),
    );
    const limitedFonts = filteredFonts.slice(0, 100).map((font) => font.family);
    allFonts = [...new Set([...allFonts, ...limitedFonts])];
    allFonts.sort((a, b) => a.localeCompare(b));
    await populateFontSelectWithRecentFonts(headlineFontSelect, "headline");
    await populateFontSelectWithRecentFonts(bodyFontSelect, "body");
  } catch (error) {
    console.error("Error fetching fonts:", error);
  }

  loadCustomFontsFromLocalStorage();
  await restoreSelectedFonts();

  document.getElementById("font-loader")?.remove();
});
