const chalk = require("chalk");
const moment = require("moment");

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
                    `[${chalk.gray(date)}]: [${chalk.blueBright(
                        type.toUpperCase()
                    )}] ${chalk.blueBright(content)}`
                );
            }
            break;
        case "event":
            {
                console.log(
                    `[${chalk.gray(date)}]: [${chalk.yellowBright(
                        type.toUpperCase()
                    )}] ${chalk.yellowBright(content)}`
                );
            }
            break;
        case "ready":
            {
                console.log(
                    `[${chalk.gray(date)}]: [${chalk.greenBright(
                        type.toUpperCase()
                    )}] ${chalk.greenBright(content)}`
                );
            }
            break;
        default:
            throw new TypeError(
                "Logger type must be either log, warn, error, debug, command, event or ready."
            );
    }
}

module.exports = { log };
