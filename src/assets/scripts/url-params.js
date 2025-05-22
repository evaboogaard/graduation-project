// const ids = ["maxFontSize", "contentWidth", "maxTypeScale", "lineHeight"];

// const sliders = ids.map((id) => document.getElementById(id));

// function updateURL() {
//   const values = sliders.map((s) => s.value).join(",");
//   const newURL = window.location.pathname + "?" + values;
//   window.history.replaceState({}, "", newURL);
// }

// sliders.forEach((slider) => {
//   slider.addEventListener("input", () => {
//     document.getElementById(slider.id + "Value").textContent = slider.value;
//     updateURL();
//   });
// });

// const match = window.location.search.match(/\?([^#]+)/);
// if (match) {
//   const values = match[1].split(",");
//   values.forEach((val, i) => {
//     if (sliders[i]) {
//       sliders[i].value = val;
//       document.getElementById(sliders[i].id + "Value").textContent = val;
//     }
//   });
// }

const ids = ["maxFontSize", "contentWidth", "maxTypeScale", "lineHeight"];
const sliders = ids.map((id) => document.getElementById(id));

function updateURL() {
  const sliderValues = sliders.map((s) => s.value);
  const colorValues = colorPairs.map(({ color }) =>
    color.value.replace("#", ""),
  );
  const newURL =
    window.location.pathname +
    "?" +
    [...sliderValues, ...colorValues].join(",");
  window.history.replaceState({}, "", newURL);
}

sliders.forEach((slider) => {
  slider.addEventListener("input", () => {
    document.getElementById(slider.id + "Value").textContent = slider.value;
    updateURL();
  });
});

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
  values.forEach((val, i) => {
    if (sliders[i]) {
      sliders[i].value = val;
      document.getElementById(sliders[i].id + "Value").textContent = val;
    }
  });

  values.slice(sliders.length).forEach((hex, i) => {
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
}
