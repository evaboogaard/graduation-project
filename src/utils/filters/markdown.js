import markdownIt from "markdown-it";

export const markdownFilter = (value) => {
  return markdownIt({ html: true, breaks: true, linkify: true }).renderInline(
    value,
  );
};
