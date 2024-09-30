const colors = require("colors");
const { DateTime } = require("luxon");
const dt = colors.gray(DateTime.now().toFormat("dd/LL/yyyy - HH:mm:ss"));

class Logger {
    /**
     * @param {import("../lib/DiscordBot").DiscordBot} client
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * @param {String} content
     */
    info(content) {
        return console.log(`[${dt}] [${colors.cyan("INFO")}] ${colors.blue(content)}`);
    }

    /**
     * @param {String} content
     */
    warn(content) {
        return console.log(
            `[${dt}] [${colors.yellow("WARN")}] ${colors.yellow(`${content}`)}`,
        );
    }

    /**
     * @param {Error} content
     * @param {String} origin
     * @param {import("@src/index").ErrorTypes} type
     */
    async error(content, type) {
        const error = content.stack ? content.stack : content;
        console.log(`[${dt}] [${colors.red("ERROR")}] ${colors.red(`${error}`)}`);
        return this.client.utils.sendError(content, type);
    }

    /**
     * @param {String} content
     */
    debug(content) {
        return console.log(`[${dt}] [${colors.green("DEBUG")}] ${colors.green(content)}`);
    }

    /**
     * @param  {string} content
     */
    write(message) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        return process.stdout.write(message);
    }

    /**
     * @param  {string} content
     */
    log(message) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        return console.log(message);
    }
}

module.exports = { Logger };
