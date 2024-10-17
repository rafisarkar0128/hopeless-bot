const { glob } = require("glob");
const { join, extname, resolve } = require("path");
const colors = require("colors");

/**
 * Returns an array of files from given path filtered by provided extensions.
 * Remember path starts from your projects main folder through **process.cwd()**.
 * @type {import("./functions").LoadFiles}
 * @default loadFiles(path,ext)
 * @example const files = await loadFiles("src", [".js"]);
 * @example const files = await loadFiles("src/commands", [".js"]);
 * @example const files = await loadFiles("src/types", [".ts"]);
 * @example const files = await loadFiles("public", [".mp4", ".mkv", ".jpeg"]);
 */

module.exports = async (path, ext) => {
  if (typeof path !== "string") {
    throw new TypeError(colors.red("Value of path must be a string"));
  }
  if (!Array.isArray(ext)) {
    throw new TypeError(
      colors.red("Value of ext must be an array with proper file extensions"),
    );
  }

  function deleteCashedFile(file) {
    const filePath = resolve(file);
    if (require.cache[filePath]) {
      delete require.cache[filePath];
    }
  }

  const files = await glob(join(process.cwd(), path, "*/**"));
  const Files = files.filter((file) => ext.includes(extname(file)));
  await Promise.all(Files.map(deleteCashedFile));
  return Files;
};
