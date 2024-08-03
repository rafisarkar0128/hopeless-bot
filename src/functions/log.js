// variables
const chalk = require("chalk");
const moment = require("moment");

// function for logging
function log(content, type = "log") {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;

    switch (type) {
        case "log": {
            return console.log(
                `[${chalk.gray(date)}]: [${chalk.blue(type.toUpperCase())}] ${content}`
            );
        }
        case "warn": {
            return console.log(
                `[${chalk.gray(date)}]: [${chalk.yellow(
                    type.toUpperCase()
                )}] ${content}`
            );
        }
        case "error": {
            return console.log(
                `[${chalk.gray(date)}]: [${chalk.red(type.toUpperCase())}] ${chalk.red(
                    content
                )}`
            );
        }
        case "debug": {
            return console.log(
                `[${chalk.gray(date)}]: [${chalk.green(type.toUpperCase())}] ${content}`
            );
        }
        case "command": {
            return console.log(
                `[${chalk.gray(date)}]: [${chalk.white(type.toUpperCase())}] ${content}`
            );
        }
        case "event": {
            return console.log(
                `[${chalk.gray(date)}]: [${chalk.white(type.toUpperCase())}] ${content}`
            );
        }
        default:
            throw new TypeError(
                "Logger type must be either warn, debug, log, ready, command or error."
            );
    }
}

// exporting the function
module.exports = { log };
