const express = require("express");
const path = require("path");
const app = express();
const port = 3000 || 8080;

async function startServer() {
    const staticPath = path.join(__dirname, "pages/home");
    app.use(express.static(staticPath));

    app.listen(port, () => {
        console.log("Server Online!");
    });
}

module.exports = { startServer };
