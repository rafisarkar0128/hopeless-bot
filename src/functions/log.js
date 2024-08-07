// variables
const chalk = require("chalk");
const moment = require("moment");

// function for logging
function log(content, type = "log") {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;

    switch (type) {
        case "log":
            {
                console.log(
                    `[${chalk.gray(date)}]: [${chalk.blue(
                        type.toUpperCase()
                    )}] ${content}`
                );
            }
            break;
        case "warn":
            {
                console.warn(
                    `[${chalk.gray(date)}]: [${chalk.yellow(
                        type.toUpperCase()
                    )}] ${chalk.yellow(content)}`
                );
            }
            break;
        case "error":
            {
                console.log(
                    `[${chalk.gray(date)}]: [${chalk.red(type.toUpperCase())}]`
                );
                console.error(content);
            }
            break;
        case "debug":
            {
                console.log(
                    `[${chalk.gray(date)}]: [${chalk.green(
                        type.toUpperCase()
                    )}] ${content}`
                );
            }
            break;
        case "command":
            {
                console.log(
                    `[${chalk.gray(date)}]: [${chalk.white(
                        type.toUpperCase()
                    )}] ${content}`
                );
            }
            break;
        case "event": {
            console.log(
                `[${chalk.gray(date)}]: [${chalk.white(
                    type.toUpperCase()
                )}] ${content}`
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
