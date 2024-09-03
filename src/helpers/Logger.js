const colors = require("colors");
const winston = require("winston");
const { DateTime } = require("luxon");
const DateTimeString = colors.gray(
    DateTime.now().toFormat("[dd/LL/yyyy - HH:mm:ss]")
);

class Logger {
    constructor() {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({
                    filename: `${process.cwd()}/logs/${DateTime.now().toFormat(
                        "yyyy-LL-dd.log"
                    )}`,
                }),
            ],
        });
    }

    /**
     *
     * @param {String} string
     */
    log(string) {
        this.logger.log({
            level: "info",
            message: "info: " + string,
        });
        console.log(DateTimeString + colors.green(" | " + string));
    }

    /**
     *
     * @param {String} string
     */
    warn(string) {
        this.logger.log({
            level: "warn",
            message: "warn: " + string,
        });
        console.log(DateTimeString + colors.yellow(" | " + string));
    }

    /**
     *
     * @param {String} string
     */
    error(string) {
        this.logger.log({
            level: "error",
            message: "error: " + string,
        });
        let error = string.stack ? string.stack : string;
        console.log(DateTimeString + colors.red(" | " + error));
    }

    /**
     *
     * @param {String} string
     */
    debug(string) {
        console.log(DateTimeString + string);
    }
}

module.exports = { Logger };
