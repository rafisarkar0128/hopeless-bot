const chalk = require("chalk");
const { getCooldown } = require("./command/getCooldown");
const { getPlayerButtons } = require("./lavalink/getPlayerButtons");

/**
 * A utility class for various helper functions
 * @abstract
 */
class Utils {
  constructor(client) {
    /**
     * Base Discord Client property for this class
     * @type {import("@lib/index").DiscordClient}
     */
    this.client = client;

    /**
     * A function to set, get and delete command cooldowns
     * @param {import("@structures/index").BaseCommand} command - The command object
     * @param {string} userId - The user id
     * @returns {number} expiration timestamp (in milliseconds)
     */
    this.getCooldown = (command, userId) => getCooldown(this.client.cooldowns, command, userId);

    /**
     * A function to generate new buttons for the music player
     * @param {import("lavalink-client").Player} player - The player to get buttons for.
     * @returns {import("discord.js").ActionRowBuilder[]} Array of action rows with buttons.
     */
    this.getPlayerButtons = (player) => getPlayerButtons(client, player);
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
   * @param {string} [type="short"] - The format type ("short", "long", "clock"). default is "short".
   * @returns {string} The formatted time string.
   * @example
   * client.utils.formatTime(93784000, "short"); // Can be left empty for default
   * // Returns "1d 2h 3m 4s"
   * client.utils.formatTime(93784000, "long");
   * // Returns "1 day 2 hours 3 minutes 4 seconds"
   * client.utils.formatTime(3723000, "clock");
   * // Returns "1:02:03"
   * client.utils.formatTime(183000, "clock");
   * // Returns "3:03"
   */
  formatTime(ms, type = "short") {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000) % 24;
    const days = Math.floor(ms / 86400000) % 30;
    const parts = [];

    switch (type) {
      case "long": {
        if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
        if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
        if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
        if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
        break;
      }

      case "clock": {
        const totalHours = hours + days * 24;
        const m = minutes < 10 ? `0${minutes}` : minutes;
        const s = seconds < 10 ? `0${seconds}` : seconds;
        if (totalHours > 0) {
          parts.push(`${totalHours}:${m}:${s}`);
        } else {
          parts.push(`${minutes}:${s}`);
        }
        break;
      }

      case "short":
      default: {
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0) parts.push(`${seconds}s`);
        break;
      }
    }

    return parts.join(", ");
  }

  /**
   * Parses a time string (e.g., "3d2h5m10s", "01:02:03", or "90") into milliseconds.
   * Supports days (d), hours (h), minutes (m), seconds (s), clock formats, and plain seconds.
   *
   * @param {string} string - The time string to parse.
   * @returns {number|null} The time in milliseconds, or null when format is invalid.
   */
  parseTime(string) {
    const value = String(string || "")
      .trim()
      .toLowerCase();
    if (!value) return null;

    // Clock format: "HH:MM:SS" or "MM:SS"
    if (/^(\d{1,2}:){1,2}\d{1,2}$/.test(value)) {
      const parts = value.split(":").map(Number);
      while (parts.length < 3) parts.unshift(0); // pad to [h, m, s]
      const [hours, minutes, seconds] = parts;
      return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }

    // Plain number => seconds
    if (/^\d+$/.test(value)) {
      return Number(value) * 1000;
    }

    // Duration tokens: e.g., "3d2h5m10s" or "3d 2h 5m 10s"
    const tokens = value.match(/(\d+\s*[dhms])/g);
    if (!tokens) return null;

    const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
    let ms = 0;
    let hasValid = false;

    for (const token of tokens) {
      const trimmed = token.trim();
      const unit = trimmed.slice(-1);
      const amount = Number(trimmed.slice(0, -1));
      if (Number.isFinite(amount) && multipliers[unit]) {
        ms += amount * multipliers[unit];
        hasValid = true;
      }
    }

    return hasValid ? ms : null;
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
   * Safely parses a value to an integer with error handling.
   * Returns null for invalid inputs instead of NaN.
   * Supports decimal and other radix bases (2-36).
   *
   * @param {*} value - The value to parse (string, number, etc).
   * @param {number} [radix=10] - The base for parsing (2-36). Default is 10.
   * @returns {number|null} The parsed integer, or null if invalid.
   * @example
   * client.utils.parseInt("42");           // Returns 42
   * client.utils.parseInt("0xFF", 16);     // Returns 255
   * client.utils.parseInt("invalid");      // Returns null
   * client.utils.parseInt(null);           // Returns null
   * client.utils.parseInt("  123  ");      // Returns 123
   */
  parseInt(value, radix = 10) {
    // Validate radix
    if (typeof radix !== "number" || radix < 2 || radix > 36 || !Number.isInteger(radix)) {
      radix = 10;
    }

    // Handle null/undefined
    if (value === null || value === undefined) {
      return null;
    }

    // Convert to string and trim
    const str = String(value).trim();

    // Reject empty strings
    if (str === "") {
      return null;
    }

    // Use native parseInt
    const result = Number.parseInt(str, radix);

    // Return null if result is NaN
    return Number.isNaN(result) ? null : result;
  }
}

module.exports = { Utils };
