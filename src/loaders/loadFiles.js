const { glob } = require("glob");
const path = require("path");

function deleteCashedFile(file) {
  const filePath = path.resolve(file);
  if (require.cache[filePath]) {
    delete require.cache[filePath];
  }
}
/**
 * @param {String} dir - Path to the files directory
 */
module.exports = async (dir) => {
  const files = await glob(path.join(dir, `**/*.js`).replace(/\\/g, "/"));
  const jsFiles = files.filter((file) => path.extname(file) === ".js");
  await Promise.all(jsFiles.map(deleteCashedFile));
  return jsFiles;
};
