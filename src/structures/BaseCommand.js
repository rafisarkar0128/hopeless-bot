/**
 * @typedef {"admin"|"config"|"development"|"general"|"information"|"utility"} CoreCategories
 * @typedef {"automod"|"moderation"|"suggestion"|"ticket"} ManagementCategories
 * @typedef {"anime"|"economy"|"fun"|"image"|"music"|"rank"|"social"} FunCategories
 * @typedef {CoreCategories|ManagementCategories|FunCategories} CommandCategories
 */

/**
 * @typedef {Object} CommandDescription The command description object.
 * @property {string} content Description of the command (1-100 characters for slash command).

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
 * @typedef {Object} CommandOptions Command options to pass to the base command class
 * @property {import("discord.js").APIApplicationCommand} data The slash command data
 * @property {string} [usage] usage for this command.
 * @property {string[]} [examples] examples for this command.
 * @property {CommandCategories} [category] The category this command belongs to.
 * @property {number} [cooldown] Command cooldown amount in seconds
 * @property {boolean} [global] Whether this command is a global command or not (mainly for slash commands).
 * @property {boolean} [disabled] Whether this command is disabled or not
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
 * Base command class
 * @abstract
 */
class BaseCommand {
  /**
   * typings for parameters
   * @param {import("@src/lib").DiscordClient} client
   * @param {CommandOptions} options
   */
  constructor(options) {
    /**
     * The slash command data
     * @type {import("discord.js").SlashCommandBuilder}
     */
    this.data = options.data ?? null;

    /**
     * The command usage string.
     * @type {string}
     */
    this.usage = options.usage ?? "No usage provided";

    /**
     * The command usage examples.
     * @type {string[]}
     */
    this.examples = options.examples ?? ["No examples provided"];

    if (this.usage.length === 0) {
      this.usage = "No usage provided";
    }

    if (Array.isArray(this.examples) && this.examples.length === 0) {
      this.examples.push("No description provided");
    }

    /**
     * The category this command belongs to.
     * @type {CommandCategories}
     */
    this.category = options.category ?? "general";

    /**
     * Command cooldown amount in seconds
     * @type {number}
     */
    this.cooldown = options.cooldown ?? this.client.config.bot.defaultCooldown;

    /**
     * Whether this command is a global command or not.
     * @type {boolean}
     */
    this.global = options.global ?? this.client.config.bot.global;

    /**
     * Whether this command is disabled or not
     * @type {boolean}
     */
    this.disabled = options.disabled ?? false;

    /**
     * Whether this command is a test only command.
     * Means it will only be able to run in test server or by verified testers.
     * @type {boolean}
     */
    this.testOnly = options.testOnly ?? false;

    /**
     * Whether this command could be used outside of guilds (servers).
     * @type {boolean}
     */
    this.guildOnly = options.guildOnly ?? false;

    /**
     * Whether this command is a premium command or not.
     * @type {boolean}
     */
    this.premium = options.premium ?? false;

    /**
     * Whether this command requires users to vote before use.
     * @type {boolean}
     */
    this.vote = options.vote ?? false;

    /**
     * Whether this command is age restricted or not.
     * @type {boolean}
     */
    this.nsfw = options.nsfw;

    /**
     * Player settings if its a music related command.
     * @type {Partial<PlayerOptionsObject>}
     */
    this.player = {
      voice: options.player?.voice ?? false,
      dj: options.player?.dj ?? false,
      active: options.player?.active ?? false,
      playing: options.player?.playing ?? false,
      djPerm: options.player?.djPerm ?? null,
    };

    /**
     * Permission settings for the command.
     * @type {Partial<CommandPermissions>}
     */
    this.permissions = {
      dev: options.permissions?.dev ?? false,
      bot: options.permissions?.bot ?? [],
      user: options.permissions?.user ?? [],
    };

    if (Array.isArray(this.permissions.bot)) {
      this.permissions.bot = this.permissions.bot.concat([
        "SendMessages",
        "ViewChannel",
        "EmbedLinks",
        "ReadMessageHistory",
      ]);
    }
  }

  /**
   * Default execute function for commands
   * @returns {Promise<void>}
   */
  async execute() {
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
