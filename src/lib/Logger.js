const colors = require("colors");
const { DateTime } = require("luxon");
const dt = colors.gray(DateTime.now().toFormat("[dd/LL/yyyy - HH:mm:ss]"));

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
        return console.log(`${dt} ${colors.bgCyan(" INFO ")} ${colors.cyan(content)}`);
    }

    /**
     * @param {String} content
     */
    warn(content) {
        return console.log(
            `${dt} ${colors.bgYellow(" WARN ")} ${colors.yellow(`${content}`)}`,
        );
    }

    /**
     * @param {Error} content
     * @param {String} origin
     * @param {String} type
     */
    async error(content, origin, type) {
        const error = content.stack ? content.stack : content;
        await this.client.utils.sendError(content, type, origin);
        return console.log(`${dt} ${colors.bgRed(" ERROR ")} ${colors.red(`${error}`)}`);
    }

    /**
     * @param {String} content
     */
    debug(content) {
        return console.log(`${dt} ${colors.bgGreen(" DEBUG ")} ${colors.green(content)}`);
    }

    /**
     * @param  {string} content
     */
    write(message) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        return process.stdout.write(
            `${colors.bgWhite(" DEBUG ")} ${colors.gray(message)}`,
        );
    }

    /**
     * @param  {string} content
     */
    log(message) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        return console.log(`${colors.bgWhite(" DEBUG ")} ${colors.gray(message)}`);
    }
}

module.exports = { Logger };
