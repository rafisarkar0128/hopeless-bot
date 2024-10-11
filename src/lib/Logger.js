const colors = require("colors");
const { DateTime } = require("luxon");

class Logger {
  /** @param {import("../lib/DiscordBot").DiscordBot} client */
  constructor(client) {
    this.client = client;
    this.dt = colors.gray(DateTime.now().toFormat(this.client.config.console.timeFormat));
  }

  /**
   * @param {String} content
   */
  info(content) {
    return console.log(`[${this.dt}] [${colors.cyan("INFO")}] ${colors.blue(content)}`);
  }

  /**
   * @param {String} content
   */
  warn(content) {
    return console.log(
      `[${this.dt}] [${colors.yellow("WARN")}] ${colors.yellow(`${content}`)}`,
    );
  }

  /**
   * @param {Error} content
   * @param {String} origin
   * @param {import("@types/utils").ErrorTypes} type
   */
  async error(content, type) {
    const error = content.stack ? content.stack : content;
    console.log(`[${this.dt}] [${colors.red("ERROR")}] ${colors.red(`${error}`)}`);
    return this.client.utils.sendError(content, type);
  }

  /**
   * @param {String} content
   */
  debug(content) {
    return console.log(
      `[${this.dt}] [${colors.green("DEBUG")}] ${colors.green(content)}`,
    );
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
