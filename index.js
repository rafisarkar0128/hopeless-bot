// variables
const { log } = require("./src/functions/log.js");
const { startBot } = require("./src/bot.js");

// function to start everything
startBot().catch((error) => log(error, "error"));
