const config = require("@src/config.js");

/**
 * @typedef {"admin"|"config"|"development"|"general"|"information"|"utility"} CoreCategories
 * @typedef {"automod"|"moderation"|"suggestion"|"ticket"} ManagementCategories
 * @typedef {"anime"|"economy"|"fun"|"image"|"music"|"rank"|"social"} FunCategories
 * @typedef {CoreCategories|ManagementCategories|FunCategories} Categories
 */

/**
 * @typedef {Object} Player Player options object for music buttons.
 * @property {boolean} [voice] Whether a user has to join a voice channel before using this button.
 * @property {boolean} [active] Whether an player is required to execute this button.
 * @property {boolean} [playing] Whether an active player is required to execute this button.
 */

/**
 * @typedef {object} Permissions Button permissions object for buttons.
 * @property {boolean} dev Whether this button is a dev only button or not.
 * @property {import("discord.js").PermissionResolvable|string[]} bot
 * Permissions required by the bot to execute this button.
 * @property {import("discord.js").PermissionResolvable|string[]} user
 * Permissions required by the user to run this button.
 */

/**
 * @typedef {Object} Options Options for the button.
 * @property {Categories} [category] The category this button belongs to.
 * @property {boolean} [global] Whether this button is a global button
 * or not (mainly for slash buttons).
 * @property {boolean} [disabled] Whether the button is disabled or not
 * @property {boolean} [guildOnly] Whether this button could be used outside of guilds (servers).
 * @property {boolean} [testOnly]  Whether this button is a test only button.
 * Means it will only be able to run in test server or by verified testers.
 * @property {boolean} [premium] Whether this button is a premium button or not.
 * @property {boolean} [nsfw] Whether this button is age restricted or not.
 */

/**
 * @typedef {Object} Data Button data to pass to the base button class
 * @property {string} customId The custom ID of the button.
 */

/**
 * @typedef {Object} Metadata Button Metadata to pass to the base button class
 * @property {Data} data The button data.
 * @property {Options} options Options for the button.
 * @property {Partial<Player>} [player] Player settings if it's a music-related button.
 * @property {Partial<Permissions>} [permissions] Button permissions object for buttons.
 */

/**
 * Base button class
 * @abstract
 */
class BaseButton {
  /**
   * The button data
   * @type {Data}
   */
  data;

  /**
   * The button options
   * @type {Options}
   */
  options;

  /**
   * The button permissions
   * @type {Permissions}
   */
  permissions;

  /**
   * The button player options
   * @type {Player}
   */
  player;

  /**
   * typings for parameters
   * @param {Metadata} metadata
   */
  constructor(metadata) {
    this.data = metadata.data ?? null;

    // Set default options
    this.options = {
      category: metadata.options?.category ?? "general",
      global: metadata.options?.global ?? config.bot.global,
      disabled: metadata.options?.disabled ?? false,
      guildOnly: metadata.options?.guildOnly ?? false,
      testOnly: metadata.options?.testOnly ?? false,
      premium: metadata.options?.premium ?? false,
      nsfw: metadata.options?.nsfw ?? false,
    };

    // set default player options
    this.player = {
      voice: metadata.player?.voice ?? false,
      active: metadata.player?.active ?? false,
      playing: metadata.player?.playing ?? false,
    };

    // set default permissions
    this.permissions = {
      dev: metadata.permissions?.dev ?? false,
      bot: metadata.permissions?.bot ?? [
        "SendMessages",
        "ViewChannel",
        "EmbedLinks",
        "ReadMessageHistory",
      ],
      user: metadata.permissions?.user ?? [],
    };
  }

  /**
   * Default execute function for the button.
   * @returns {Promise<void>}
   */
  async execute() {
    return await Promise.resolve();
  }
}

module.exports = { BaseButton };
