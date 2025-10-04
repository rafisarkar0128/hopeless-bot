const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Logger } = require("./Logger.js");
const { Utils } = require("@utils/index");
const { LavalinkClient } = require("./LavalinkClient.js");
const { DatabaseManager } = require("@database/index");
const Genius = require("genius-lyrics");

/**
 * The client for this bot.
 * @extends {Client}
 */
class DiscordClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember,
      ],
      allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
      },
      failIfNotExists: true,
    });

    /**
     * The base configuration file
     * @type {import("@src/config.js")}
     */
    this.config = require("@src/config.js");

    /**
     * The package.json file of this project
     * @type {import("@root/package.json")}
     */
    this.pkg = require("@root/package.json");

    /**
     * Collection of colors for embeds
     * @type {import("@resources/colors.js")}
     */
    this.color = require("@resources/colors.js");

    /**
     * Collection of emojies to use with messages
     * @type {import("@resources/emojis.js")}
     */
    this.emoji = require("@resources/emojis.js");

    /**
     * Resources to use for various purposes
     * @type {import("@resources/index.js")}
     */
    this.resources = require("@resources/index.js");

    /**
     * The helpers for the client
     * @type {import("@helpers/index.js")}
     */
    this.helpers = require("@helpers/index.js");

    /**
     * The handlers for this bot
     * @type {import("@handlers/index.js")}
     */
    this.handlers = require("@handlers/index.js");

    /**
     * A collection to store all the commands
     * @type {Collection<string, import("@structures/index.js").BaseCommand>}
     */
    this.commands = new Collection();

    /**
     * A collection to store aliases for prefix commands
     * @type {Collection<string, string>}
     */
    this.aliases = new Collection();

    /**
     * A collection to store cooldown data
     * @type {Collection<string, Collection<string, string>>}
     */
    this.cooldowns = new Collection();

    /**
     * An array to hold the application command data (slash, context etc.)
     * @type {(import("discord.js").RESTPostAPIApplicationCommandsJSONBody & { global: boolean })[]}
     */
    this.applicationCommands = [];

    /**
     * An array to hold the deleted or soon to be deleted messages
     * @type {import("discord.js").Message[]}
     */
    this.deletedMessages = [];

    /**
     * The utility tools manager for the bot
     * @type {Utils}
     */
    this.utils = new Utils(this);

    /**
     * The log manager for the bot
     * @type {Logger}
     */
    this.logger = new Logger();

    /**
     * The database manager for the bot
     * @type {DatabaseManager}
     */
    this.mongodb = new DatabaseManager(this);

    // Initialize Music Manager if enabled
    if (this.config.music.enabled) {
      /**
       * The lavalink manager for the bot
       * @type {LavalinkClient}
       */
      this.lavalink = new LavalinkClient(this);

      /**
       * The genius client to fetch lyrics
       * @type {Genius.Client}
       */
      this.genius = new Genius.Client(this.config.genius.token);
    }
  }

  /**
   * A function to start everything
   * @returns {Promise<void>}
   */
  async start() {
    try {
      // load necessary modules
      this.helpers.loadWelcome(this);
      this.helpers.antiCrash(this);

      // validate the config file
      this.helpers.validateConfig(this);

      // load locales, events & commands
      await this.helpers.loadLocales(this);
      await this.helpers.loadEvents(this);
      await this.helpers.loadCommands(this);

      // Log into the client
      this.login(this.config.bot.token);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

module.exports = { DiscordClient };
