const ids = ["maxFontSize", "contentWidth", "maxTypeScale", "lineHeight"];
const sliders = ids.map((id) => document.getElementById(id));

function updateURL() {
  const sliderValues = sliders.map((s) => s.value);
  const colorValues = colorPairs.map(({ color }) =>
    color.value.replace("#", ""),
  );

  // Get selected fonts
  const headlineFont = document.getElementById("headline-font-selector").value;
  const bodyFont = document.getElementById("body-font-selector").value;

  // Encode fonts to handle spaces and special characters
  const fontValues = [
    encodeURIComponent(headlineFont),
    encodeURIComponent(bodyFont),
  ];

  const newURL =
    window.location.pathname +
    "?" +
    [...sliderValues, ...colorValues, ...fontValues].join(",");

  window.history.replaceState({}, "", newURL);
}

const colorPairs = [
  {
    color: document.getElementById("headline-color"),
    hex: document.getElementById("headline-hex"),
  },
  {
    color: document.getElementById("details-color"),
    hex: document.getElementById("details-hex"),
  },
  {
    color: document.getElementById("body-color"),
    hex: document.getElementById("body-hex"),
  },
  {
    color: document.getElementById("background-color"),
    hex: document.getElementById("background-hex"),
  },
];

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
  const headlineFont = decodeURIComponent(
    values[sliders.length + colorPairs.length] || "",
  );
  const bodyFont = decodeURIComponent(
    values[sliders.length + colorPairs.length + 1] || "",
  );

  if (headlineFont) {
    document.getElementById("headline-font-selector").value = headlineFont;
    document.documentElement.style.setProperty(
      "--font-headline",
      `'${headlineFont}'`,
    );
  }

  if (bodyFont) {
    document.getElementById("body-font-selector").value = bodyFont;
    document.documentElement.style.setProperty("--font-body", `'${bodyFont}'`);
  }
}

export { updateURL as updateUrl };
