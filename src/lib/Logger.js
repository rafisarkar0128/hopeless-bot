const chalk = require("chalk");
const { DateTime } = require("luxon");
const { basename } = require("path");
const { format } = require("util");
const figures = require("figures").default;

/**
 * A utility class for managing client console logs.
 */
class Logger {
  /** @private */
  _padEnd(str, targetLength) {
    str = String(str);
    targetLength = parseInt(targetLength, 10) || 0;

    if (str.length >= targetLength) {
      return str;
    }
    if (String.prototype.padEnd) {
      return str.padEnd(targetLength);
    }

    targetLength -= str.length;
    return str + " ".repeat(targetLength);
  }

  /** @private */
  _arrayify(x) {
    return Array.isArray(x) ? x : [x];
  }

  /**
   * A function to format anything to string
   * @private
   * @param {any} str
   * @returns {string}
   */
  _formatMessage(str) {
    return format(...this._arrayify(str));
  }

  /**
   * Get the date of the log message.
   * @private
   * @returns {string}
   */
  get _dateTime() {
    return chalk.grey(DateTime.now().toFormat("[dd/MM/yyyy] [hh:mm:ss a]"));
  }

  /**
   * Get the origin of the log.
   * @private
   * @returns {string}
   */
  get _filename() {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, stack) => stack;
    const { stack } = new Error();
    Error.prepareStackTrace = _;

    const callers = stack.map((x) => x.getFileName());
    const FilePath = callers.find((x) => x !== callers[0]);
    let file = FilePath ? basename(FilePath) : "anonymous";
    file = file.length > 20 ? file.substring(0, 17) + "..." : file;

    return chalk.grey(`[${chalk.cyan(this._padEnd(file, 20))}]`);
  }

  /**
   * A function to build the log message
   * @private
   * @param {string} type
   * @param {...any} args
   * @returns {string}
   */
  _buildLog(typeString, ...args) {
    const meta = [];
    let msg = "";

    meta.push(this._dateTime);
    meta.push(this._filename);
    meta.push(chalk.grey(`[${typeString}]`));
    meta.push(chalk.grey(figures.pointer));

    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
      if (args[0] instanceof Error) {
        msg = args[0];
      } else {
        msg = this._formatMessage(args);
      }
    } else {
      msg = this._formatMessage(args);
    }

    if (msg instanceof Error && msg.stack) {
      const [name, ...rest] = msg.stack.split("\n");
      meta.push(name);
      meta.push(chalk.grey(rest.map((l) => l.replace(/^/, "\n")).join("")));
    } else {
      meta.push(msg);
    }

    return meta.join(" ");
  }

  /**
   * For logging information type messages
   * @param {String|String[]} content - can be modified with colors
   * @returns {void}
   */
  info(...content) {
    const typeString = chalk.blue(this._padEnd("INFO", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging warning type messages
   * @param {string|string[]|any} content - defaults to yellow but can be modified with colors
   * @returns {void}
   */
  warn(...content) {
    const typeString = chalk.yellow(this._padEnd("WARNING", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging error type messages
   * @param {Error|string} content - defaults to red but can be modified with colors
   * @return {void}
   */
  error(...content) {
    const typeString = chalk.red(this._padEnd("ERROR", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging debug type messages
   * @param {string|string[]|any} content - defaults to green but can be modified with colors
   * @return {void}
   */
  debug(...content) {
    const typeString = chalk.magenta(this._padEnd("DEBUG", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging success type messages to test if the code is working as expected
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  success(...content) {
    const typeString = chalk.green(this._padEnd("SUCCESS", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging anything
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  log(...content) {
    const typeString = chalk.white(this._padEnd("LOG", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging pause type messages
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  pause(...content) {
    const typeString = chalk.yellow(this._padEnd("PAUSE", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging start type messages
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  start(...content) {
    const typeString = chalk.green(this._padEnd("START", 7));
    console.log(this._buildLog(typeString, ...content));
  }

  /**
   * For logging star (special) type messages
   * @param {string|string[]|any} content - Can be modified with colors
   * @return {void}
   */
  star(...content) {
    const typeString = chalk.yellow(this._padEnd("STAR", 7));
    console.log(this._buildLog(typeString, ...content));
  }
}

module.exports = { Logger };
