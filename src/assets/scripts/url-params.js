const ids = ["maxFontSize", "contentWidth", "maxTypeScale", "lineHeight"];

const sliders = ids.map((id) => document.getElementById(id));

function updateURL() {
  const values = sliders.map((s) => s.value).join(",");
  const newURL = window.location.pathname + "?" + values;
  window.history.replaceState({}, "", newURL);
}

sliders.forEach((slider) => {
  slider.addEventListener("input", () => {
    document.getElementById(slider.id + "Value").textContent = slider.value;
    updateURL();
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
}
