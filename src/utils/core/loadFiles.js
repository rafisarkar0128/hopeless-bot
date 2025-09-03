const { glob } = require("glob");
const { join, resolve, extname } = require("path");

/**
 * @typedef {".js"|".cjs"|".mjs"|".jsx"} JSExtensions
 * @typedef {".ts"|".cts"|".mts"|".tsx"} TSExtensions
 * @typedef {".json"|".yaml"|".yml"|".xml"} ConfigExtensions
 * @typedef {"jpeg"|".jpg"|".png"|".gif"|".svg"|".webp"|".ico"} ImageExtensions
 * @typedef {".mp3"|".wav"|".flac"|".aac"|"ogg"} AudioExtensions
 * @typedef {".mp4"|".mkv"|".avi"|".mov"|".mpeg"} VideoExtensions
 * @typedef {".csv"|".txt"|".log"} LogExtensions
 * @typedef {JSExtensions|TSExtensions} ScriptExtensions
 * @typedef {AudioExtensions|VideoExtensions} MediaExtensions
 * @typedef {ImageExtensions|ConfigExtensions} AssetExtensions
 * @typedef {ScriptExtensions|MediaExtensions|AssetExtensions|LogExtensions} FileTypes
 */

/**
 * Returns an array of files from given path filtered by provided extensions.
 * @param {string} pathToFile - path from projects root dir
 * @param {FileTypes[]|string[]} ext - extensions to filter files
 * @returns {Promise<string[]>}
 * @example
 * const jsFiles = await client.utils.getFiles("src", [".js"]);
 * @example
 * const commandFiles = await client.utils.getFiles("src/commands", [".js"]);
 * @example
 * const tsFiles = await client.utils.getFiles("src/types", [".ts"]);
 * @example
 * const assets = await client.utils.getFiles("public", [".mp4", ".mkv", ".jpeg"]);
 */
async function loadFiles(pathToFile, ext) {
  // Helper function to delete cached files
  function deleteCashedFile(file) {
    const filePath = resolve(file);
    delete require.cache[filePath];
  }

  // Retrieve and filter files
  const allFiles = await glob(join(process.cwd(), pathToFile, "*/**").replace(/\\/g, "/"));
  const files = allFiles.filter((file) => ext.includes(extname(file)));
  await Promise.all(files.map(deleteCashedFile));
  return files;
}

module.exports = { loadFiles };
