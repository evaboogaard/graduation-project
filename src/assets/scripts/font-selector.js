document.addEventListener("DOMContentLoaded", async () => {
  const API_KEY = "AIzaSyA-9_V4skPfwKR4Yoe39cfNByMklvvZUtM";
  const headlineFontSelect = document.getElementById("headline-font-selector");
  const bodyFontSelect = document.getElementById("body-font-selector");

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
      const headlineOption = document.createElement("option");
      headlineOption.value = font.family;
      headlineOption.textContent = font.family;
      headlineOption.style.fontFamily = `'${font.family}', sans-serif`;
      headlineFontSelect.appendChild(headlineOption);

      const bodyOption = document.createElement("option");
      bodyOption.value = font.family;
      bodyOption.textContent = font.family;
      bodyOption.style.fontFamily = `'${font.family}', sans-serif`;
      bodyFontSelect.appendChild(bodyOption);
    });

    headlineFontSelect.addEventListener("change", () => {
      const selectedFont = headlineFontSelect.value;
      loadGoogleFont(selectedFont);
      document.documentElement.style.setProperty(
        "--font-headline",
        `'${selectedFont}', sans-serif`,
      );
    });

    bodyFontSelect.addEventListener("change", () => {
      const selectedFont = bodyFontSelect.value;
      loadGoogleFont(selectedFont);
      document.documentElement.style.setProperty(
        "--font-body",
        `'${selectedFont}', sans-serif`,
      );
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
});
