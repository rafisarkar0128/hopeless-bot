const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const { Manager } = require("moonlink.js");
const { AntiCrash } = require("@helpers/AntiCrash");
const { loadEvents, loadLocales, loadCommands } = require("./functions/index");
const colors = require("colors");

class DiscordBot extends Client {
  /** typingss for discord.js ClientOptions
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    // local stored data
    this.config = require(`@config/config.js`);
    this.colors = require(`@config/colors.json`);
    this.wait = require("timers/promises").setTimeout;
    this.database = require("@src/database/mongoose.js");
    this.pkg = require("@root/package.json");
    this.logger = new Logger(this);
    this.utils = new Utils(this);
    this.syncCommands = require("@helpers/syncCommands");

    // client collections

    /**
     * types for event collection
     * @type {Collection<string, import("@structures/event").EventStructure>}
     */
    this.events = new Collection();

    /**
     * types for
     * @type {import("@types/types").NewCommand[]} */
    this.newCommands = new Array();

    /**
     * types for commands collection
     * @type {Collection<string, import("@types/commands").CommandStructure>}
     */
    this.commands = new Collection();

    /**
     * types for alias collection
     * @type {Collection<string, string>}
     */
    this.aliases = new Collection();

    /**
     * types for slash command collection
     * @type {Collection<string, import("@structures/command").CommandStructure>}
     */
    this.slashCommands = new Collection();

    /**
     * types for contextmenu collection
     * @type {Collection<string, import("@types/commands").ContextMenuStructure>}
     */
    this.contexts = new Collection();

    // Music Manager
    if (this.config.plugins.music.enabled) {
      this.moonlink = new Manager({
        nodes: this.config.plugins.music.lavalink_nodes,
        options: {
          clientName: `${this.pkg.name}@${this.pkg.version}`,
        },
        sendPayload: (guildId, payload) => {
          this.guilds.cache.get(guildId)?.shard?.send(JSON.parse(payload));
        },
      });
    }
  }

  /**
   * @return {Promise<string>}
   */
  async getLogbox() {
    const boxen = (await import("boxen")).default;
    const logbox = boxen(
      [
        `Welcome to ${colors.blue(this.pkg.name.toUpperCase())} js project`,
        `Running on Node.JS ${colors.green(process.version)}`,
        `Version ${colors.yellow(this.pkg.version)}`,
        `Coded with 💖 by ${colors.cyan(this.pkg.author.name)}`,
      ].join("\n"),
      {
        borderColor: "#00BFFF",
        textAlignment: "center",
        padding: {
          left: 10,
          right: 10,
          top: 1,
          bottom: 1,
        },
      },
    );
    return logbox;
  }

  /** A function to get the Bot logo
   * @returns {string}
   */
  getVanity() {
    // ansi colors with escape
    let esc = "\u001b[0m";
    let red = "\u001b[38;5;196m";
    let blue = "\u001b[38;5;45m";
    let green = "\u001b[38;5;49m";
    let yellow = "\u001b[38;5;11m";

    let vanity = [
      `y     __`,
      `y  ."\`  \`".`,
      `y /   /\\   \\`,
      `y|    \\/    | b_                      _               _           _  g______`,
      `y \\   ()   / b| |__   ___  _ __   ___| | ___  ___ ___| |__   ___ | |_g\\ \\ \\ \\ `,
      `y  '.____.'  b| '_ \\ / _ \\| '_ \\ / _ \\ |/ _ \\/ __/ __| '_ \\ / _ \\| __|g\\ \\ \\ \\ `,
      `y   {_.="}   b| | | | (_) | |_) |  __/ |  __/\\__ \\__ \\ |_) | (_) | |_  g) ) ) )`,
      `y   {_.="}   b|_| |_|\\___/| .__/ \\___|_|\\___||___/___/_.__/ \\___/ \\__|g/ / / /`,
      `y   \`-..-\`   r============b|_|r========================================g/_/_/_/`,
    ].join("\n");

    vanity = vanity
      .replace(/r/g, red)
      .replace(/g/g, green)
      .replace(/b/g, blue)
      .replace(/y/g, yellow)
      .replace(/e/g, esc);

    return vanity;
  }

  /** a function to start everything
   * @returns {Promise<void>}
   */
  async start() {
    // load locales
    loadLocales();

    if (this.config.plugins.antiCrash.enabled) AntiCrash(this);

    console.clear();
    if (this.config.console.debug.mainLogo) {
      console.log(this.getVanity());
      console.log(await this.getLogbox());
    }

    // Load event modules
    await loadEvents(this, "src/events");

    // Load command modules
    await loadCommands(this, "src/commands");

    // Connect to the database
    await this.database.connect(this);

    // Log into the client
    await this.login(this.config.bot_token);
  }
}

module.exports = { DiscordBot };
