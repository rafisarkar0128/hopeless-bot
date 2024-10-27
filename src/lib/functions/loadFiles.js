const { glob } = require("glob");
const { join, extname, resolve } = require("path");
const colors = require("colors");
const { t } = require("i18next");

/**
 * Returns an array of files from given path filtered by provided extensions.
 * Remember path starts from your projects main folder through **process.cwd()**.
 * So provide path from the base folder.
 * @type {import("./functions").LoadFiles}
 * @default loadFiles(path,ext)
 * @example const files = await loadFiles("src", [".js"]);
 * @example const files = await loadFiles("src/commands", [".js"]);
 * @example const files = await loadFiles("src/types", [".ts"]);
 * @example const files = await loadFiles("public", [".mp4", ".mkv", ".jpeg"]);
 */
async function loadFiles(path, ext) {
  if (typeof path !== "string") {
    throw new TypeError(t("errors:type.string", { param: colors.yellow("path") }));
  }
  if (!Array.isArray(ext)) {
    throw new TypeError(t("errors:type.array", { param: colors.yellow("ext") }));
  }

  function deleteCashedFile(file) {
    const filePath = resolve(file);
    delete require.cache[filePath];
  }

  const files = await glob(join(process.cwd(), path, "*/**"));
  const Files = files.filter((file) => ext.includes(extname(file)));
  await Promise.all(Files.map(deleteCashedFile));
  return Files;
}

module.exports = { loadFiles };
