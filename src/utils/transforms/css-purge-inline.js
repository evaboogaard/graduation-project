import { PurgeCSS } from "purgecss";
import { JSDOM, VirtualConsole } from "jsdom";

const insertCss = (html, css) => {
  const virtualConsole = new VirtualConsole(html);
  const dom = new JSDOM(html, { virtualConsole });

  const { document } = dom.window;
  let head = document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.innerHTML = css;
  head.appendChild(style);

  return dom.serialize();
};

export const purgeCSS = async (content, outputPath) => {
  if (outputPath && outputPath.endsWith(".html")) {
    //array of css files to combine
    const cssFiles = ["./dist/assets/css/global.css"];

    const purgecssResult = await new PurgeCSS().purge({
      content: [
        {
          raw: content,
          extension: "html",
        },
      ],
      css: cssFiles,
      safelist: {
        standard: [/^m/, /^l/],
        greedy: [/role/],
      },
      keyframes: true,
    });

    let css = "";

    if (purgecssResult.length > 0) {
      for (let i = 0; i < purgecssResult.length; i++) {
        css = css.concat(purgecssResult[i].css);
      }

      return insertCss(content, css);
    }
  }
  return content;
};
