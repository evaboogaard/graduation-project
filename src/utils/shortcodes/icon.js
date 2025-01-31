import { getFileHash } from "../build/file-hash.js";

export const iconShortcode = (props) => {
  const fileHash = getFileHash(`./dist/assets/icons.svg`);

  const { style, width, icon, alt = "", ...otherProps } = props;
  const className = ["icon", props.class].join(" ").trim();

  const attributes = {
    ...otherProps,
    "aria-hidden": "true",
    focusable: "false",
    ...(width ? { style: `width: ${width}; height: ${width};` } : {}),
    ...(alt ? { "aria-label": alt } : {}),
    class: className,
  };

  const attributeString = Object.entries(attributes)
    .filter(([key, value]) => !["__keywords"].includes(key))
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  return `<svg ${attributeString}><use xlink:href="/assets/icons.svg?${fileHash}#svg-${icon}"/></svg>`;
};
