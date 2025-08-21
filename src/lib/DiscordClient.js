const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Logger } = require("./Logger.js");
const { Utils } = require("@root/src/utils/Utils.js");
const { LavalinkClient } = require("./LavalinkClient.js");
const { DatabaseManager } = require("@src/database/DatabaseManager.js");
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
     * @type {import("@src/resources/colors.js")}
     */
    this.color = require("@src/resources/colors.js");

    /**
     * Collection of emojies to use with messages
     * @type {import("@src/resources/emojis.js")}
     */
    this.emoji = require("@src/resources/emojis.js");

    /**
     * Resources to use for various perposes
     * @type {import("@src/resources")}
     */
    this.resources = require("@src/resources");

    /**
     * The helpers for the client
     * @type {import("@src/helpers")}
     */
    this.helpers = require("@src/helpers");

    /**
     * The handlers for this bot
     * @type {import("@src/handlers")}
     */
    this.handlers = require("@src/handlers");

    /**
     * A collection to store all the commands
     * @type {Collection<string, import("../structures/BaseCommand.js")>}
     */
    this.commands = new Collection();

    /**
     * A collection to store aliases for prefix commands
     * @type {Collection<string, string>}
     */
    this.aliases = new Collection();

    /**
     * A collection to store all the contextmenu commands
     * @type {Collection<string, import("../structures/BaseCommand.js")>}
     */
    this.contextMenus = new Collection();

    /**
     * A collection to store cooldown data
     * @type {Collection<string, Collection<string, string>>}
     */
    this.cooldowns = new Collection();

    /**
     * An array to hold the application command data (slash, context etc.)
     * @type {import("discord.js").ApplicationCommandData[]}
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
    this.db = new DatabaseManager(this);

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
    // load necessary modules
    this.helpers.logVanity(this);
    this.helpers.antiCrash(this);

    // validate the config file
    this.helpers.validateConfig(this);

    // load locales, events & commands
    await this.helpers.loadLocales(this);
    await this.helpers.loadEvents(this);
    // await this.helpers.loadCommands(this);

    // Log into the client
    this.login(this.config.bot.token);
  }
}

module.exports = { DiscordClient };
