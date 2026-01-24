const config = require("@src/config.js");

/**
 * @typedef {"admin"|"config"|"development"|"general"|"information"|"utility"} CoreCategories
 * @typedef {"automod"|"moderation"|"suggestion"|"ticket"} ManagementCategories
 * @typedef {"anime"|"economy"|"fun"|"image"|"music"|"rank"|"social"} FunCategories
 * @typedef {CoreCategories|ManagementCategories|FunCategories} CommandCategories
 */

/**
 * @typedef {Object} CommandDetails The command details object.
 * @property {string} [usage] The usage of the command.
 * @property {string[]} [examples] examples for this command.
 */

/**
 * @typedef {Object} PlayerOptionsObject Player options object for music commands.
 * @property {boolean} [voice] Whether a user has to join a voice channel before using this command.
 * @property {boolean} [active] Whether an player is required to execute this command.
 * @property {boolean} [playing] Whether an active player is required to execute this command.
 */

/**
 * @typedef {object} CommandPermissions Command permissions object for commands.
 * @property {boolean} dev Whether this command is a dev only command or not.
 * @property {import("discord.js").PermissionResolvable|string[]} bot
 * Permissions required by the bot to execute this command.
 * @property {import("discord.js").PermissionResolvable|string[]} user
 * Permissions required by the user to run this command.
 * Will be used as **default_member_permissions** for the slash command.
 */

/**
 * @typedef {Object} CommandOptions Options for the command.
 * @property {CommandCategories} [category] The category this command belongs to.
 * @property {number} [cooldown] Command cooldown amount in seconds
 * @property {boolean} [global] Whether this command is a global command
 * or not (mainly for slash commands).
 * @property {boolean} [disabled] Whether the command is disabled or not
 * @property {boolean} [guildOnly] Whether this command could be used outside of guilds (servers).
 * @property {boolean} [testOnly]  Whether this command is a test only command.
 * Means it will only be able to run in test server or by verified testers.
 * @property {boolean} [premium] Whether this command is a premium command or not.
 * @property {boolean} [nsfw] Whether this command is age restricted or not.
 * @property {Partial<PlayerOptionsObject>} [player] Player settings if it's a music-related command.
 * @property {Partial<CommandPermissions>} [permissions] Command permissions object for commands.
 */

/**
 * @typedef {Object} PrefixCommandOptions Options for prefix commands.
 * @property {boolean} [disabled] Whether the prefix command is disabled or not.
 * @property {string[]} [aliases] The aliases for the command.
 * @property {number} [minArgsCount] Minimum number of arguments required to run this command.
 */

/**
 * @typedef {Object} SlashCommandOptions Options for slash commands.
 * @property {boolean} [disabled] Whether the slash command is disabled or not.
 */

/**
 * @typedef {Object} CommandMetadata Command Metadata to pass to the base command class
 * @property {import("discord.js").SlashCommandBuilder} data The slash command data
 * @property {CommandOptions} options Options for the command.
 * @property {PrefixCommandOptions} prefixOptions Options for prefix commands.
 * @property {SlashCommandOptions} slashOptions Options for slash commands.
 * @property {CommandDetails} [details] The details for this command.
 */

/**
 * Base command class
 * @abstract
 */
class BaseCommand {
  /**
   * The slash command data
   * @type {import("discord.js").SlashCommandBuilder}
   */
  data;

  /**
   * The command options
   * @type {CommandOptions}
   */
  options;

  /**
   * The command prefix options
   * @type {PrefixCommandOptions}
   */
  prefixOptions;

  /**
   * The command slash options
   * @type {SlashCommandOptions}
   */
  slashOptions;

  /**
   * The command details
   * @type {CommandDetails}
   */
  details;

  /**
   * typings for parameters
   * @param {CommandMetadata} metadata
   */
  constructor(metadata) {
    this.data = metadata.data ?? null;

    this.options = {
      category: metadata.options?.category ?? "general",
      cooldown: metadata.options?.cooldown ?? config.bot.defaultCooldown,
      global: metadata.options?.global ?? config.bot.global,
      disabled: metadata.options?.disabled ?? false,
      guildOnly: metadata.options?.guildOnly ?? false,
      testOnly: metadata.options?.testOnly ?? false,
      premium: metadata.options?.premium ?? false,
      nsfw: metadata.options?.nsfw ?? false,
      player: {
        voice: metadata.options?.player?.voice ?? false,
        active: metadata.options?.player?.active ?? false,
        playing: metadata.options?.player?.playing ?? false,
      },
      permissions: {
        dev: metadata.options?.permissions?.dev ?? false,
        bot: metadata.options?.permissions?.bot ?? [
          "SendMessages",
          "ViewChannel",
          "EmbedLinks",
          "ReadMessageHistory",
        ],
        user: metadata.options?.permissions?.user ?? [],
      },
    };

    this.prefixOptions = {
      disabled: metadata?.prefixOptions?.disabled ?? false,
      aliases: metadata?.prefixOptions?.aliases ?? [],
      minArgsCount: metadata?.prefixOptions?.minArgsCount ?? 0,
    };

    this.slashOptions = {
      disabled: metadata?.slashOptions?.disabled ?? false,
    };

    this.details = {
      usage: metadata?.details?.usage ?? "No usage provided",
      examples: metadata?.details?.examples ?? ["No examples provided"],
    };
  }

  /**
   * Default execute function for prefix commands
   * @returns {Promise<void>}
   */
  async executePrefix() {
    return await Promise.resolve();
  }

  /**
   * Default execute function for slash commands
   * @returns {Promise<void>}
   */
  async executeSlash() {
    return await Promise.resolve();
  }

  /**
   * Default execute function for commands with autocomplete options
   * @returns {Promise<void>}
   */
  async autocomplete() {
    return await Promise.resolve();
  }
}

module.exports = { BaseCommand };
