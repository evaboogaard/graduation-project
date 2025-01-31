import fs from "fs";
import crypto from "crypto";

/**
 * Get the hash of a file based on its content
 * => files that haven't changed keep the same hash value and the browser can cache them
 *
 * @param {string} src - The path to the file, relative to the project root, always starting with "./"
 * @returns {string}
 */
export const getFileHash = (src) => {
  const fileContent = fs.readFileSync(src, "utf8");
  const fileHash = crypto
    .createHash("sha256")
    .update(fileContent)
    .digest("hex")
    .slice(0, 8);

  return fileHash;
};
