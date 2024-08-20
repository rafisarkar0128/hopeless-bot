const { glob } = require("glob");
const path = require("path");

function deleteCashedFile(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

async function loadFiles(dir) {
    try {
        const files = await glob(
            path.join(__dirname, "..", dir, `**/*.js`).replace(/\\/g, "/")
        );
        const jsFiles = files.filter((file) => path.extname(file) === ".js");
        await Promise.all(jsFiles.map(deleteCashedFile));
        return jsFiles;
    } catch (error) {
        throw error;
    }
}

module.exports = { loadFiles };
