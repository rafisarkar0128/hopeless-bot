const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Logger } = require("./Logger.js");
const { Utils } = require("@utils/index");
const { Helpers } = require("@helpers/index.js");
const { Handlers } = require("@handlers/index.js");
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
    this.colors = require("@resources/colors.js");

    /**
     * Resources to use for various purposes
     * @type {import("@resources/index.js")}
     */
    this.resources = require("@resources/index.js");

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
     * @type {Collection<string, Collection<string, number>>}
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
     * The log manager for the bot
     * @type {Logger}
     */
    this.logger = new Logger();

    /**
     * The helpers for the client
     * @type {Helpers}
     */
    this.helpers = new Helpers(this);

    /**
     * The handlers for this bot
     * @type {Handlers}
     */
    this.handlers = new Handlers(this);

    /**
     * The utility tools manager for the bot
     * @type {Utils}
     */
    this.utils = new Utils(this);

    /**
     * The database manager for the bot
     * @type {DatabaseManager}
     */
    this.mongodb = new DatabaseManager(this);

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

  /**
   * A function to start everything
   * @returns {Promise<void>}
   */
  async start() {
    try {
      // load necessary modules
      this.helpers.loadWelcome();
      this.helpers.antiCrash();

      // validate the config file
      this.helpers.validateConfig();

      // load locales, events & commands
      await this.helpers.loadLocales();
      await this.helpers.loadEvents();
      await this.helpers.loadCommands();

      // Log into the client
      this.login(this.config.bot.token);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

module.exports = { DiscordClient };
