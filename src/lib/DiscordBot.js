const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const { LavalinkPlayer } = require("./LavalinkPlayer.js");

class DiscordBot extends Client {
  /** typingss for discord.js ClientOptions
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    // Load configuration and package information
    this.config = require(`@config/config.js`);
    this.pkg = require("@root/package.json");

    // Initialize global functions and utilities
    this.wait = require("timers/promises").setTimeout;
    this.helpers = require("@helpers/index.js");
    this.logger = new Logger(this);
    this.utils = new Utils(this);
    this.syncCommands = require("@helpers/syncCommands");

    // Initialize client collections with types
    /** @type {Collection<string, import("@structures/event.d.ts").EventStructure>} */
    this.events = new Collection();

    /** @type {Collection<string, import("@structures/command.d.ts").PrefixCommandStructure>} */
    this.commands = new Collection();

    /** @type {Collection<string, string>} */
    this.aliases = new Collection();

    /** @type {Collection<string, import("@structures/command.d.ts").SlashCommandStructure>} */
    this.slashCommands = new Collection();

    /** @type {Collection<string, import("@structures/context.d.ts").ContextMenuStructure>} */
    this.contexts = new Collection();

    // Initialize Music Manager if enabled
    if (this.config.plugins.music.enabled) {
      this.lavalink = new LavalinkPlayer(this);
    }
  }

  /** a function to start everything
   * @returns {Promise<void>}
   */
  async start() {
    console.clear();

    // Load the anticrash system
    this.helpers.antiCrash(this);

    // Load locales
    this.helpers.loadLocales(this);

    // Log the vanity
    this.helpers.logVanity(this);

    // Load event modules
    await this.helpers.loadEvents(this, "src/events");

    // Load command modules
    await this.helpers.loadCommands(this, "src/commands");

    // Connect to the database
    await this.helpers.connectdb(this);

    // Log into the client
    await this.login(this.config.bot_token);
  }
}

module.exports = { DiscordBot };
