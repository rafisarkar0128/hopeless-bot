const colors = require("colors");
const { glob } = require("glob");
const path = require("path");
const { EmbedBuilder, WebhookClient } = require("discord.js");

class Utils {
  /** @param {import("@lib/DiscordBot").DiscordBot} client */
  constructor(client) {
    this.client = client;
  }

  /** A function to send error to a discord channel
   * @type {import("../types/utils").SendError}
   * @example client.utils.sendError(error, type, data);
   */
  async sendError(error, type, data) {
    if (!error) return;
    if (!this.client.database) {
    }
    const errStack = error?.stack ? error.stack : error;
    const webhookClient = process.env.ERROR_WEBHOOK_URL
      ? new WebhookClient({
          url: process.env.ERROR_WEBHOOK_URL,
        })
      : undefined;

    const embed = new EmbedBuilder()
      .setColor(this.client.config.colors.Wrong)
      .setTitle(`**An Error Occoured**`)
      .setDescription(
        `\`\`\`\n${
          errStack.length > 4000 ? errStack.substring(0, 4000) + "..." : errStack
        }\n\`\`\``,
      )
      .setFooter({
        text: `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2,
        )} MB CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
      })
      .setTimestamp();

    return webhookClient
      .send({
        username: this.client.user?.tag || undefined,
        avatarURL: this.client.user?.avatarURL() || undefined,
        embeds: [embed],
      })
      .catch((error) => {
        console.log(
          colors.yellow("[AntiCrash] | [Send_Error_Logs] | [Start] : ==============="),
        );
        console.log(colors.red(error));
        console.log(
          colors.yellow("[AntiCrash] | [Send_Error_Logs] | [End] : ==============="),
        );
      });
  }

  /** Checks if a string contains a URL
   * @type {import("../types/utils").ContainsLink}
   * @example client.utils.containsLink(text);
   */
  containsLink(text) {
    return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
      text,
    );
  }

  /** Checks if a string is a valid discord invite
   * @type {import("../types/utils").ContainsDiscordInvite}
   * @example client.utils.containsDiscordInvite(text);
   */
  containsDiscordInvite(text) {
    return /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
      text,
    );
  }

  /**
   * A funtion to get table border in provided color
   * @type {import("../types/utils.d.ts").GetTableBorder}
   */
  getTableBorder(color) {
    var border = new Object();

    Object.keys(this.client.config.table.border).forEach((key) => {
      border[key] = colors[color](this.client.config.table.border[key]);
    });

    return border;
  }

  /** Returns a random number below a max
   * @type {import("../types/utils").GetRandomInt}
   * @example client.utils.getRandomInt(max);
   */
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /** Return a random color from colors.json
   * @type {import("../types/utils").GetRandomColor}
   * @example client.utils.getRandomColor();
   */
  getRandomColor() {
    let colorsArray = new Array();
    Object.values(this.client.config.colors).forEach((code) => {
      colorsArray.push(code);
    });

    return colorsArray[Math.floor(Math.random() * colorsArray.length)];
  }

  /** Checks if a string is a valid Hex color
   * @type {import("../types/utils").IsHex}
   * @example client.utils.isHex(text)
   */
  isHex(text) {
    return /^#[0-9A-F]{6}$/i.test(text);
  }

  /** Checks if a string is a valid Hex color
   * @type {import("../types/utils").IsValidColor}
   * @example client.utils.isValidColor(text);
   */
  isValidColor(text) {
    if (this.client.colors.indexOf(text) > -1) {
      return true;
    } else return false;
  }

  /** Returns hour difference between two dates
   * @type {import("../types/utils").DiffHours}
   * @example client.utils.dissHours(Date2, Date1);
   */
  diffHours(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  /** Returns remaining time in days, hours, minutes and seconds
   * @type {import("../types/utils").Timeformat}
   * @example client.utils.timeFormat(timeInMillis);
   */
  timeFormat(timeInMillis) {
    const days = Math.floor(timeInMillis / 86400000);
    const hours = Math.floor(timeInMillis / 3600000) % 24;
    const minutes = Math.floor(timeInMillis / 60000) % 60;
    const seconds = Math.floor(timeInMillis / 1000) % 60;
    return (
      (days > 0 ? `${days} days, ` : "") +
      (hours > 0 ? `${hours} hours, ` : "") +
      (minutes > 0 ? `${minutes} minutes, ` : "") +
      (seconds > 0 ? `${seconds} seconds` : "")
    );
  }

  /** Converts duration to milliseconds
   * @type {import("../types/utils").DurationToMillis}
   * @example client.utils.durationToMillis(duration);
   */
  durationToMillis(duration) {
    return (
      duration
        .split(":")
        .map(Number)
        .reduce((acc, curr) => curr + acc * 60) * 1000
    );
  }

  /** Returns time remaining until provided date
   * @type {import("../types/utils").GetRemainingTime}
   * @example client.utils.getRemainingTime(timeUntil);
   */
  getRemainingTime(timeUntil) {
    const seconds = Math.abs((timeUntil - new Date()) / 1000);
    const time = Utils.timeformat(seconds);
    return time;
  }

  /** Takes a single or array of permissions and returns a formated string
   * @type {import("../types/utils").ParsePermissions}
   * @example client.utils.parsePermissions(permissions)
   */
  parsePermissions(p) {
    const word = ` permission${p.length > 1 ? "s" : ""}`;
    return `${p.map((p) => `**\`${p}\`**`).join(", ")} ${word}`;
  }
}

module.exports = { Utils };
