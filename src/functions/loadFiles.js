// variables
const { glob } = require("glob");
const path = require("path");

// function to delete caches
async function deleteCashedFile(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

// main function
async function loadFiles(dirName) {
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
}

// exporting the function
module.exports = { loadFiles };
