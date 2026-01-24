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
  /** The base configuration file */
  config = require("@src/config.js");

  /** The package.json file of this project */
  pkg = require("@root/package.json");

  /** Collection of colors for embeds */
  colors = require("@resources/colors.js");

  /** Resources to use for various purposes */
  resources = require("@resources/index.js");

  /**
   * A collection to store all the commands
   * @type {Collection<string, import("@structures/index.js").BaseCommand>}
   */
  commands = new Collection();

  /**
   * A collection to store all the buttons
   * @type {Collection<string, import("@structures/index.js").BaseButton>}
   */
  buttons = new Collection();

  /**
   * A collection to store aliases for prefix commands
   * @type {Collection<string, string>}
   */
  aliases = new Collection();

  /**
   * A collection to store cooldown data
   * @type {Collection<string, Collection<string, number>>}
   */
  cooldowns = new Collection();

  /**
   * An array to hold the application command data (slash, context etc.)
   * @type {(import("discord.js").RESTPostAPIApplicationCommandsJSONBody & { global: boolean })[]}
   */
  applicationCommands = [];

  /**
   * An array to hold the deleted or soon to be deleted messages
   * @type {string[]}
   */
  deletedMessages = [];

  /** The log manager for the bot */
  logger;

  /** The helpers for the client */
  helpers;

  /** The handlers for this bot */
  handlers;

  /** The utility tools manager for the bot */
  utils;

  /** The database manager for the bot */
  mongodb;

  /** The lavalink manager for the bot */
  lavalink;

  /** The genius client to fetch lyrics */
  genius;

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

    // Initialize managers after super()
    this.logger = new Logger();
    this.helpers = new Helpers(this);
    this.handlers = new Handlers(this);
    this.utils = new Utils(this);
    this.mongodb = new DatabaseManager(this);
    this.lavalink = new LavalinkClient(this);
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

      // load locales, events, commands & components
      await this.helpers.loadLocales();
      await this.helpers.loadEvents();
      await this.helpers.loadCommands();
      await this.helpers.loadButtons();

      // Log into the client
      this.login(this.config.bot.token);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

module.exports = { DiscordClient };
