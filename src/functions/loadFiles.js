const { glob } = require("glob");
const path = require("path");

function deleteCashedFile(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

module.exports = async (dirName) => {
    try {
        const files = await glob(
            path.join(process.cwd(), dirName, "**/*.js").replace(/\\/g, "/")
        );
        const jsFiles = files.filter((file) => path.extname(file) === ".js");
        await Promise.all(jsFiles.map(deleteCashedFile));
        return jsFiles;
    } catch (error) {
        throw error;
    }
};
