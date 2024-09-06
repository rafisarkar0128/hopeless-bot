const { EmbedBuilder, WebhookClient } = require("discord.js");
const path = require("path");
const config = require(`${process.cwd()}/config`);
const { Wrong } = require(`${process.cwd()}/colors.json`);
const colors = require("colors");
const winston = require("winston");
const { DateTime } = require("luxon");
const DateTimeString = colors.gray(
  DateTime.now().toFormat("[dd/LL/yyyy - HH:mm:ss]"),
);

class Logger {
  /**
   *
   * @param {String} dir - Log files directory path. Must be a string.
   */
  constructor(dir) {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: path.join(
            dir || `${process.cwd()}/logs`,
            `${DateTime.now().toFormat("yyyy-LL-dd")}.log`,
          ),
        }),
      ],
    });
  }

  /**
   *
   * @param {String} string
   */
  log(string) {
    console.log(DateTimeString + string);
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
  async error(string) {
    this.logger.log({
      level: "error",
      message: "error: " + string,
    });
    let error = string.stack ? string.stack : string;
    await sendError(string);
    console.log(DateTimeString + colors.red(" | " + error));
  }

  /**
   *
   * @param {String} string
   */
  debug(string) {
    this.logger.log({
      level: "info",
      message: "info: " + string,
    });
    console.log(DateTimeString + colors.gray(" | " + string));
  }
}

/**
 *
 * @param {Client} client
 * @param {Error} error
 */
async function sendError(error) {
  if (!error) return;

  const webhookLogger = process.env.ERROR_WEBHOOK_URL
    ? new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL })
    : undefined;

  const errStack = error.stack ? error.stack : error;

  const errorEmbed = new EmbedBuilder()
    .setColor(Wrong)
    .setTitle(`**An Error Occoured**`)
    .setFields(
      {
        name: "Error Code",
        value: `\`\`\`\n${error?.name || "Error"}\n\`\`\``,
        inline: true,
      },
      {
        name: "Error Message",
        value: `\`\`\`\n${error?.message || "NA"}\n\`\`\``,
        inline: true,
      },
      {
        name: "Error Stack",
        value: `\`\`\`sh\n${
          errStack.length > 4096 ? errStack.substr(0, 4000) + "..." : errStack
        }\n\`\`\``,
      },
    )
    .setFooter({
      text: `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
        2,
      )} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
    });

  webhookLogger.send({ embeds: [errorEmbed] }).catch((err) => {
    throw err;
  });
}

module.exports = { Logger };
