const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const { AntiCrash } = require("@helpers/AntiCrash");
const { LavalinkPlayer } = require("./LavalinkPlayer.js");

class DiscordBot extends Client {
  /** typingss for discord.js ClientOptions
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    // local stored data
    this.config = require(`@config/config.js`);
    /** @deprecated will be removed in future updates */
    this.colors = require(`@config/colors.json`);
    this.pkg = require("@root/package.json");

    // all global functions
    this.wait = require("timers/promises").setTimeout;
    this.functions = require("./functions/index.js");
    this.logger = new Logger(this);
    this.utils = new Utils(this);
    this.syncCommands = require("@helpers/syncCommands");

    // client collections with types
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

    // Music Manager
    if (this.config.plugins.music.enabled) {
      this.lavalink = new LavalinkPlayer(this);
    }
  }

  /** a function to start everything
   * @returns {Promise<void>}
   */
  async start() {
    console.clear();

    // load the anticrash system
    AntiCrash(this);

    // load locales
    this.functions.loadLocales(this);

    // log the vanity
    this.functions.logVanity(this);

    // load event modules
    await this.functions.loadEvents(this, "src/events");

    // load command modules
    await this.functions.loadCommands(this, "src/commands");

    // connect to the database
    await this.functions.connectdb(this);

    // log into the client
    await this.login(this.config.bot_token);
  }
}

module.exports = { DiscordBot };
