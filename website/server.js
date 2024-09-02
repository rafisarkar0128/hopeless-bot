const { logger } = require("../utils/log.js");
const Logger = new logger();
const path = require("path");

const config = require("../config.js");
const port = config.website.port;

const express = require("express");
const server = express();

server.use(express.static(`${process.cwd()}/website`));
server.all("/", (req, res) => {});

function keepAlive() {
    server.listen(port, () => {
        setTimeout(() => {
            Logger.log(` | Website is Online! Listening to port: ${port}`);
        }, 5e3);
    });
}

module.exports = keepAlive;
