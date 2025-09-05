const chalk = require("chalk");
const { t } = require("i18next");
const fs = require("fs");
const path = require("path");

/**
 * A utility class for various helper functions
 * @abstract
 */
class Utils {
  constructor(client) {
    /**
     * Base Client property for this class
     * @type {import("@lib/index").DiscordClient}
     */
    this.client = client;
  }

  /**
   * A function to add a suffix to a number
   * @param {number} number - the number to add suffix with
   * @returns {string}
   * @example
   * const number = 1 || 2 || 3 || 20 || "any number"
   * client.utils.addSuffix(number)
   * // output => "1st" || "2nd" || "3rd" || "20th" || "any number with suffix"
   */
  addSuffix(number) {
    if (number % 100 >= 11 && number % 100 <= 13) return number + "th";
    switch (number % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
    return number + "th";
  }

  /**
   * A function to get table border in different color.
   * Note: only chalk colors are available
   * @param {keyof import("chalk").Chalk} color
   */
  getTableBorder(color) {
    const borders = {
      topBody: `─`,
      topJoin: `┬`,
      topLeft: `┌`,
      topRight: `┐`,
      bottomBody: `─`,
      bottomJoin: `┴`,
      bottomLeft: `└`,
      bottomRight: `┘`,
      bodyLeft: `│`,
      bodyRight: `│`,
      bodyJoin: `│`,
      joinBody: `─`,
      joinLeft: `├`,
      joinRight: `┤`,
      joinJoin: `┼`,
    };
    let tableBorder = {};
    Object.keys(borders).forEach((key) => {
      tableBorder[key] = chalk[color](borders[key]);
    });
    return tableBorder;
  }

  /**
   * Checks if a string contains a URL
   * @param {string} text - the text to check
   * @returns {boolean}
   * @example
   * const text = "https://discord.com/download"
   * client.utils.containsLink(text);
   * // output => true
   */
  containsLink(text) {
    return /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
      text
    );
  }

  /**
   * Checks if a string is a valid discord invite
   * @param {string} text - the text to check
   * @returns {boolean}
   * @example client.utils.containsDiscordInvite(text);
   * output => true || false
   */
  containsDiscordInvite(text) {
    return /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/.test(
      text
    );
  }

  /**
   * Returns a random number below a max
   * @param {number} max
   * @returns {number}
   * @example client.utils.getRandomInt(max);
   */
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /**
   * Checks if a string is a valid Hex color
   * @param {string} text
   * @returns {boolean}
   * @example client.utils.color.isHex(text);
   * output => true || false
   */
  isHex(text) {
    return /^#[0-9A-F]{6}$/i.test(text);
  }

  /**
   * Truncates a string to a specified length and appends an ellipsis ("...") if truncated.
   * If the string is shorter than or equal to the specified length, it is returned unchanged.
   * Note: The ellipsis is included in the total length, so the actual string content will be (index - 3) characters.
   * @param {string} string - The string to truncate.
   * @param {number} index - The maximum length of the returned string, including the ellipsis.
   * @returns {string} The truncated string with ellipsis if needed.
   * @example
   * const string = "This is a string for demonstration."; // length = 35
   * client.utils.sliceString(string, 25);
   * // output => "This is a string for demo..."
   */
  sliceString(string, index) {
    if (!index) return string;
    if (string.length <= index) return string;
    return string.slice(0, index - 3) + "...";
  }

  /**
   * Converts milliseconds to a human-readable string in days, hours, minutes, and seconds.
   * If the 'long' parameter is true, returns the time in long form (e.g., '1 day 2 hours 3 minutes 4 seconds').
   *
   * @param {number} ms - Time in milliseconds.
   * @param {boolean} [long=false] - Whether to use long form for units.
   * @returns {string} The formatted time string.
   * @example
   * client.utils.formatTime(93784000);
   * // Returns "1d 2h 3m 4s"
   * client.utils.formatTime(93784000, true);
   * // Returns "1 day 2 hours 3 minutes 4 seconds"
   */
  formatTime(ms, long = false) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000) % 24;
    const days = Math.floor(ms / 86400000) % 30;
    const parts = [];

    if (long) {
      if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
      if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
      if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
      parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
      return parts.join(", ");
    }

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(", ");
  }

  /**
   * Parses a time string (e.g., "3d2h5m10s") into milliseconds.
   * Supports days (d), hours (h), minutes (m), and seconds (s).
   *
   * @param {string} string - The time string to parse.
   * @returns {number} The time in milliseconds.
   * @example
   * client.utils.parseTime("5m");
   * // Returns 300000
   * client.utils.parseTime("1h1m1s");
   * // Returns 3661000
   */
  parseTime(string) {
    const time = string.match(/(\d+[dhms])/g);
    if (!time) return 0;
    let ms = 0;
    for (const t of time) {
      const unit = t[t.length - 1];
      const amount = Number(t.slice(0, -1));
      if (unit === "d") ms += amount * 24 * 60 * 60 * 1000;
      else if (unit === "h") ms += amount * 60 * 60 * 1000;
      else if (unit === "m") ms += amount * 60 * 1000;
      else if (unit === "s") ms += amount * 1000;
    }
    return ms;
  }

  /**
   * Splits an array into multiple subarrays (chunks) of a specified size.
   * Each chunk will have a maximum of the specified size.
   *
   * @param {any[]} array - The array to split into chunks.
   * @param {number} size - The maximum size of each chunk.
   * @returns {any[][]} An array of chunked subarrays.
   * @example
   * // Returns [[1,2,3],[4,5,6],[7]]
   * client.utils.chunk([1,2,3,4,5,6,7], 3);
   */
  chunk(array, size) {
    const chunked_arr = [];
    for (let index = 0; index < array.length; index += size) {
      chunked_arr.push(array.slice(index, size + index));
    }
    return chunked_arr;
  }

  /**
   * Creates a textual progress bar based on the current value, total, and size.
   * The bar is filled proportionally to the current value.
   *
   * @param {number} current - The current progress value.
   * @param {number} total - The total value representing 100% progress.
   * @param {number} [size=20] - The length of the progress bar (number of characters).
   * @returns {string} A string representing the progress bar and percentage.
   * @example
   * // Returns something like: "▓▓▓▓▓░░░░░░░░░░░░░░░░ 25%"
   * client.utils.progressBar(5, 20);
   */
  progressBar(current, total, size = 20) {
    const percent = Math.round((current / total) * 100);
    const filledSize = Math.round((size * current) / total);
    const filledBar = "▓".repeat(filledSize);
    const emptyBar = "░".repeat(size - filledSize);
    return `${filledBar}${emptyBar} ${percent}%`;
  }

  /**
   * Converts a number of bytes into a human-readable string with appropriate units (e.g., KB, MB).
   *
   * @param {number} bytes - The number of bytes.
   * @param {number} [decimals=2] - Number of decimal places to include.
   * @returns {string} The formatted string with size units.
   * @example
   * // Returns "1.23 MB"
   * client.utils.formatBytes(1293941);
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  }

  /**
   * Converts a number to a string with commas as thousands separators.
   * For example, 1234567 becomes "1,234,567".
   *
   * @param {number} number - The number to format.
   * @returns {string} The formatted number as a string with commas.
   * @example
   * // Returns "1,234,567"
   * client.utils.formatNumber(1234567);
   */
  formatNumber(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  /**
   * A function to paginate mutiple embeds together.
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").EmbedBuilder[]} embeds
   * @param {string} lng
   * @returns {Promise<void>}
   */
  async paginate(interaction, embeds, lng) {
    let page = 0;
    const totalPages = embeds.length;
    const msgOptions = {
      embeds: [embeds[page]],
      components: [this.buttons.getPage(page, totalPages)],
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(msgOptions);
    } else {
      await interaction.reply(msgOptions);
    }

    const collector = interaction.channel.createMessageComponentCollector();
    collector.on("collect", async (button) => {
      if (button.user.id !== interaction.user.id) {
        return await button.reply({
          content: t("misc.buttons.notAuthor", { lng }),
          flags: "Ephemeral",
        });
      }

      switch (button.customId) {
        case "page_first": {
          page = 0;
          break;
        }
        case "page_last": {
          page = embeds.length - 1;
          break;
        }
        case "page_back": {
          page--;
          break;
        }
        case "page_next": {
          page++;
          break;
        }
        case "page_stop": {
          await button.deferUpdate();
          return collector.stop();
        }
      }

      await button.update({
        embeds: [embeds[page]],
        components: [this.buttons.getPage(page, totalPages)],
      });
    });

    collector.on("end", async () => {
      await interaction.deleteReply().catch(() => null);
    });
  }

  /**
   * Gets all available locales by reading the 'src/locales' directory.
   * Each subdirectory in 'src/locales' is considered a locale if it contains language files.
   * @returns {string[]} An array of available locale codes.
   * @example
   * client.utils.getAvailableLocales();
   * // Returns ['en-US', 'pt-BR', ...]
   */
  getAvailableLocales() {
    return fs.readdirSync(path.join(process.cwd(), "src/locales")).filter((dir) => {
      const dirPath = path.join(process.cwd(), "src/locales", dir);
      return fs.lstatSync(dirPath).isDirectory() && fs.readdirSync(dirPath).length > 0;
    });
  }
}

module.exports = { Utils };
