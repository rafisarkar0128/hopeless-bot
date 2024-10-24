const colors = require("colors");
const { DateTime } = require("luxon");

class Logger {
  /** @param {import("../lib/DiscordBot").DiscordBot} client */
  constructor(client) {
    this.client = client;
    this.dt = colors.gray(
      DateTime.now().toFormat(this.client.config.console.time_format),
    );
    //this.origin = this.getLogOrigin(); //.split(/[\\/]/).pop();
  }
  //getLogOrigin() {
  //  let filename;
  //
  //  let _pst = Error.prepareStackTrace;
  //  Error.prepareStackTrace = function (err, stack) {
  //    return stack;
  //  };
  //  try {
  //    let error = new Error();
  //    let callerfile;
  //    let currentfile;
  //
  //    currentfile = error.stack.shift().getFileName();
  //
  //    while (error.stack.length) {
  //      callerfile = err.stack.shift().getFileName();
  //
  //      if (currentfile !== callerfile) {
  //        filename = callerfile;
  //        break;
  //      }
  //    }
  //  } catch (err) {}
  //
  //  //return filename;
  //  return new Error("Testing");
  //}

  /**
   * @param {String} content
   */
  info(content) {
    //console.log(colors.yellow(this.origin));
    return console.log(`[${this.dt}] [${colors.cyan("INFO")}] ${content}`);
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

const { EmbedBuilder, WebhookClient, Colors } = require("discord.js");
const { inspect } = require("util");
const webhook = undefined;

class UpdatedLogger {
  constructor() {
    this.origin = this._getLogOrigin().split(/[\\/]/).pop();
  }
  _getLogOrigin() {
    let filename;

    let _pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };
    try {
      let err = new Error();
      let callerfile;
      let currentfile;

      currentfile = err.stack.shift().getFileName();

      while (err.stack.length) {
        callerfile = err.stack.shift().getFileName();

        if (currentfile !== callerfile) {
          filename = callerfile;
          break;
        }
      }
    } catch (err) {}
    Error.prepareStackTrace = _pst;

    return filename;
  }

  error(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  🛑  [` +
      `${this.origin.length > 25 ? this.origin.substring(0, 17) + "..." : this.origin}` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }

  info(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  ✉️   [` +
      `${this.origin.length > 25 ? this.origin.substring(0, 17) + "..." : this.origin}` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }
  warn(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  ⚠️   [` +
      `${this.origin.length > 25 ? this.origin.substring(0, 17) + "..." : this.origin}` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }

  success(content) {
    const output =
      new Date().toLocaleTimeString() +
      `  ✅  [` +
      `${this.origin.length > 25 ? this.origin.substring(0, 17) + "..." : this.origin}` +
      `] ` +
      " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
      "| " +
      content;
    if (webhook) {
      webhook.send({
        content: `> \`\`\`${output}\`\`\``,
      });
    }
    console.log(output);
  }
  custom(content) {
    console.log(
      new Date().toLocaleTimeString() +
        `  🛑  [` +
        `${
          this.origin.length > 20 ? this.origin.substring(0, 17) + "..." : this.origin
        }` +
        `] ` +
        " ".repeat(20 - (this.origin.length > 20 ? 20 : this.origin.length)) +
        "| " +
        content,
    );
  }
}

// logger.success(colors.cyan(`</> • ${colors.yellow(i)} Events has been loaded.`));
