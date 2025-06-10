const ids = [
  "minFontSize",
  "maxFontSize",
  "minTypeScale",
  "maxTypeScale",
  "contentWidth",
  "lineHeight",
];
const sliders = ids.map((id) => document.getElementById(id));

const colorPairs = [
  {
    color: document.getElementById("headline-color"),
    hex: document.getElementById("headline-hex"),
  },
  {
    color: document.getElementById("secondary-background-color"),
    hex: document.getElementById("secondary-background-hex"),
  },
  {
    color: document.getElementById("body-color"),
    hex: document.getElementById("body-hex"),
  },
  {
    color: document.getElementById("background-color"),
    hex: document.getElementById("background-hex"),
  },
  {
    color: document.getElementById("secondary-text-color"),
    hex: document.getElementById("secondary-text-hex"),
  },
];
function updateURL() {
  const sliderValues = sliders.map((s) => s.value);
  const colorValues = colorPairs.map(({ color }) =>
    color.value.replace("#", ""),
  );

  const headlineSelector = document.getElementById("headline-font-selector");
  const bodySelector = document.getElementById("body-font-selector");

  const cleanFont = (font) => {
    if (!font) return "";
    const lower = font.toLowerCase().trim();
    if (lower === "" || lower === "select a font") return "";
    return font;
  };

  // Haal fontwaarden uit de selectors
  let headlineFont = cleanFont(headlineSelector?.value);
  let bodyFont = cleanFont(bodySelector?.value);

  // Als ze leeg zijn, probeer ze uit de URL te halen
  if (!headlineFont || !bodyFont) {
    const match = window.location.search.match(/\?([^#]+)/);
    if (match) {
      const values = match[1].split(",");
      const savedHeadline = decodeURIComponent(
        values[sliders.length + colorPairs.length] || "",
      );
      const savedBody = decodeURIComponent(
        values[sliders.length + colorPairs.length + 1] || "",
      );
      if (!headlineFont) headlineFont = cleanFont(savedHeadline);
      if (!bodyFont) bodyFont = cleanFont(savedBody);
    }
  }

  const fontValues = [headlineFont, bodyFont].map(encodeURIComponent);

  const newURL =
    window.location.pathname +
    "?" +
    [...sliderValues, ...colorValues, ...fontValues].join(",");

  window.history.replaceState({}, "", newURL);
}

colorPairs.forEach(({ color, hex }) => {
  function sync(val) {
    color.value = val;
    hex.value = val;
    document.documentElement.style.setProperty(
      `--color-${color.id.replace("-color", "")}`,
      val,
    );
    updateURL();
  }

  color.addEventListener("input", () => sync(color.value));
  hex.addEventListener("input", () => {
    if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) {
      sync(hex.value);
    }
  });
});

// Lees waarden uit de URL bij het laden
const match = window.location.search.match(/\?([^#]+)/);
if (match) {
  const values = match[1].split(",");

  // Slider values
  values.forEach((val, i) => {
    if (sliders[i]) {
      sliders[i].value = val;
      document.getElementById(sliders[i].id + "Value").textContent = val;
    }
  });

  // Color values
  values
    .slice(sliders.length, sliders.length + colorPairs.length)
    .forEach((hex, i) => {
      const val = `#${hex}`;
      if (colorPairs[i]) {
        colorPairs[i].color.value = val;
        colorPairs[i].hex.value = val;
        document.documentElement.style.setProperty(
          `--color-${colorPairs[i].color.id.replace("-color", "")}`,
          val,
        );
      }
    });

  // Font values
  const rawHeadlineFont = decodeURIComponent(
    values[sliders.length + colorPairs.length] || "",
  );
  const rawBodyFont = decodeURIComponent(
    values[sliders.length + colorPairs.length + 1] || "",
  );

  // Zelfde clean functie als updateURL
  const cleanFont = (font) => {
    if (!font) return "";
    const lower = font.toLowerCase().trim();
    if (lower === "" || lower === "select a font") return "";
    return font;
  };

  const headlineFont = cleanFont(rawHeadlineFont);
  const bodyFont = cleanFont(rawBodyFont);

  // Zet fonts alleen als ze valide zijn
  const headlineSelector = document.getElementById("headline-font-selector");
  if (headlineFont) {
    headlineSelector.value = headlineFont;
    document.documentElement.style.setProperty(
      "--font-headline",
      `'${headlineFont}'`,
    );
  } else {
    headlineSelector.value = ""; // of de lege optie value
  }

  const bodySelector = document.getElementById("body-font-selector");
  if (bodyFont) {
    bodySelector.value = bodyFont;
    document.documentElement.style.setProperty("--font-body", `'${bodyFont}'`);
  } else {
    bodySelector.value = "";
  }
}

export { updateURL };

function restoreFromURL() {
  const query = window.location.search.slice(1);
  if (!query) return;

  const values = query.split(",");

  const sliderCount = sliders.length;
  const colorCount = colorPairs.length;

  const sliderValues = values.slice(0, sliderCount);
  const colorValues = values.slice(sliderCount, sliderCount + colorCount);
  const [headlineFont, bodyFont] = values.slice(sliderCount + colorCount);

  // Restore slider values
  sliders.forEach((slider, index) => {
    slider.value = sliderValues[index];
  });

  // Restore color values
  colorPairs.forEach(({ color }, index) => {
    color.value = "#" + colorValues[index];
  });

  // Restore fonts
  if (headlineFont) {
    document.getElementById("headline-font-selector").value =
      decodeURIComponent(headlineFont);
  }
  if (bodyFont) {
    document.getElementById("body-font-selector").value =
      decodeURIComponent(bodyFont);
  }

  console.log("Restored fonts:", headlineFont, bodyFont);
}

window.addEventListener("DOMContentLoaded", () => {
  restoreFromURL();
});
