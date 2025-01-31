import { getFileHash } from "../build/file-hash.js";

export const scriptShortcode = ({
  src,
  defer = true,
  isModule = true,
  ...props
}) => {
  const fileHash = getFileHash(`./dist/assets/scripts/${src}`);

  return `
    <script
      src="/assets/scripts/${src}?${fileHash}"
      ${isModule ? 'type="module"' : ""}
      ${defer ? "defer" : ""}
      ${Object.keys(props)
        .filter((key) => key !== "__keywords")
        .map((key) => `${key}="${props[key]}"`)
        .join(" ")}
    ></script>
  `;
};
