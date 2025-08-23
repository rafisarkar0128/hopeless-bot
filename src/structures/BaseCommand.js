const config = require("@src/config.js");

/**
 * @typedef {"admin"|"config"|"development"|"general"|"information"|"utility"} CoreCategories
 * @typedef {"automod"|"moderation"|"suggestion"|"ticket"} ManagementCategories
 * @typedef {"anime"|"economy"|"fun"|"image"|"music"|"rank"|"social"} FunCategories
 * @typedef {CoreCategories|ManagementCategories|FunCategories} CommandCategories
 */

/**
 * @typedef {Object} CommandParameters The command parameters object.
 * @property {string} name The name of the parameter.
 * @property {string} description The description of the parameter.
 * @property {boolean} [required] Whether the parameter is required or not.
 */

/**
 * @typedef {Object} CommandDetails The command details object.
 * @property {string} [usage] The usage of the command.
 * @property {string[]} [examples] examples for this command.
 * @property {Array<CommandParameters>} [params] The parameters for this command.
 */

/**
 * @typedef {Object} PlayerOptionsObject Player options object for music commands.
 * @property {boolean} [voice] Whether a user has to join a voice channel before using this command.
 * @property {boolean} [dj] Whether a user must have DJ permission to use this command.
 * @property {boolean} [active] Whether an player is required to execute this command.
 * @property {boolean} [playing] Whether an active player is required to execute this command.
 * @property {?string} [djPerm] DJ permission.
 */

/**
 * @typedef {object} CommandPermissions Command permissions object for commands.
 * @property {boolean} dev Whether this command is a dev only command or not.
 * @property {import("discord.js").PermissionResolvable|string[]} bot Permissions required by the bot to execute this command.
 * @property {import("discord.js").PermissionResolvable|string[]} user Permissions required by the user to run this command.
 * Will be used as **default_member_permissions** for the slash command.
 */

/**
 * @typedef {Object} CommandOptions Options for the command.
 * @property {CommandCategories} [category] The category this command belongs to.
 * @property {number} [cooldown] Command cooldown amount in seconds
 * @property {boolean} [global] Whether this command is a global command
 * or not (mainly for slash commands).
 * @property {{slash?: boolean, prefix?: boolean}|boolean} [disabled] Whether the prefix, slash,
 * or the whole command is disabled or not
 * @property {boolean} [guildOnly] Whether this command could be used outside of guilds (servers).
 * @property {boolean} [testOnly]  Whether this command is a test only command.
 * Means it will only be able to run in test server or by verified testers.
 * @property {boolean} [premium] Whether this command is a premium command or not.
 * @property {boolean} [vote] Whether this command requires users to vote before use.
 * @property {boolean} [nsfw] Whether this command is age restricted or not.
 * @property {Partial<PlayerOptionsObject>} [player] Player settings if it's a music-related command.
 * @property {Partial<CommandPermissions>} [permissions] Command permissions object for commands.
 */

/**
 * @typedef {Object} PrefixCommandOptions Options for prefix commands.
 * @property {string[]} [aliases] The aliases for the command.
 * @property {number} [minArgsCount] Minimum number of arguments required to run this command.
 * @property {CommandDetails} [details] The details for this command.
 */

/**
 * @typedef {Object} SlashCommandOptions Options for slash commands.
 * @property {boolean} [ephemeral] Whether the command is ephemeral or not.
 * @property {CommandDetails} [details] The details for this command.
 */

/**
 * @typedef {Object} CommandMetadata Command Metadata to pass to the base command class
 * @property {import("discord.js").SlashCommandBuilder} data The slash command data
 * @property {CommandOptions} options Options for the command.
 * @property {PrefixCommandOptions} prefixOptions Options for prefix commands.
 * @property {SlashCommandOptions} slashOptions Options for slash commands.
 */

/**
 * Base command class
 * @abstract
 */
class BaseCommand {
  /**
   * typings for parameters
   * @param {CommandMetadata} metadata
   */
  constructor(metadata) {
    /**
     * The slash command data
     * @type {import("discord.js").SlashCommandBuilder}
     */
    this.data = metadata.data ?? null;

    /**
     * The command options
     * @type {CommandOptions}
     */
    this.options = {};

    this.options.category = metadata.options.category ?? "general";
    this.options.cooldown = metadata.options.cooldown ?? config.bot.defaultCooldown;
    this.options.global = metadata.options.global ?? config.bot.global;
    this.options.disabled = metadata.options.disabled ?? { slash: false, prefix: false };
    this.options.guildOnly = metadata.options.guildOnly ?? false;
    this.options.testOnly = metadata.options.testOnly ?? false;
    this.options.premium = metadata.options.premium ?? false;
    this.options.vote = metadata.options.vote ?? false;
    this.options.nsfw = metadata.options.nsfw ?? false;

    this.options.player = {
      voice: metadata.options.player?.voice ?? false,
      dj: metadata.options.player?.dj ?? false,
      active: metadata.options.player?.active ?? false,
      playing: metadata.options.player?.playing ?? false,
      djPerm: metadata.options.player?.djPerm ?? null,
    };

    this.options.permissions = {
      dev: metadata.options.permissions.dev ?? false,
      bot: metadata.options.permissions.bot ?? [
        "SendMessages",
        "ViewChannel",
        "EmbedLinks",
        "ReadMessageHistory",
      ],
      user: metadata.options.permissions.user ?? [],
    };

    // Ensure bot permissions always include required defaults
    if (Array.isArray(this.options.permissions?.bot)) {
      this.options.permissions.bot = this.options.permissions.bot.concat([
        "SendMessages",
        "ViewChannel",
        "EmbedLinks",
        "ReadMessageHistory",
      ]);
    }

    /**
     * The command prefix options
     * @type {PrefixCommandOptions}
     */
    this.prefixOptions = {
      aliases: metadata.prefixOptions.aliases ?? [],
      minArgsCount: metadata.prefixOptions.minArgsCount ?? 0,
      details: {
        usage: metadata.prefixOptions.details.usage ?? "No usage provided",
        examples: metadata.prefixOptions.details.examples ?? ["No examples provided"],
        params: metadata.prefixOptions.details.params ?? [],
      },
    };

    /**
     * The command slash options
     * @type {SlashCommandOptions}
     */
    this.slashOptions = {
      ephemeral: metadata.slashOptions.ephemeral ?? false,
      details: {
        usage: metadata.slashOptions.details.usage ?? "No usage provided",
        examples: metadata.slashOptions.details.examples ?? ["No examples provided"],
        params: metadata.slashOptions.details.params ?? [],
      },
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
