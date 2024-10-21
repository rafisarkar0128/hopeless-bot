const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const { table } = require("table");
const { AntiCrash } = require("@helpers/AntiCrash");
const { loadEvents, loadLocales, loadCommands, connectdb } = require("./functions/index");
const colors = require("colors");
const { t } = require("i18next");

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

    // all global functions
    this.logger = new Logger(this);
    this.utils = new Utils(this);
    this.addColors = this.syncCommands = require("@helpers/syncCommands");

    // client collections

    /**
     * types for event collection
     * @type {Collection<string, import("@structures/event.d.ts").EventStructure>}
     */
    this.events = new Collection();

    /**
     *
     * @type {import("../types/types.d.ts").NewCommand[]} */
    this.Commands = new Array();

    /**
     * types for commands collection
     * @type {Collection<string, import("@structures/command.d.ts").PrefixCommandStructure>}
     */
    this.commands = new Collection();

    /**
     * types for alias collection
     * @type {Collection<string, string>}
     */
    this.aliases = new Collection();

    /**
     * types for slash command collection
     * @type {Collection<string, import("@structures/command.d.ts").SlashCommandStructure>}
     */
    this.slashCommands = new Collection();

    /**
     * types for contextmenu collection
     * @type {Collection<string, import("@structures/context.d.ts").ContextMenuStructure>}
     */
    this.contexts = new Collection();

    // Music Manager
    if (this.config.plugins.music.enabled) {
      //this.lavalink = new LavalinkPlayer(this);
    }
  }

  /**
   * A function to log basic info of the bot
   * @returns {string}
   */
  async logVanity() {
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

    /**
     * @type {import("table").TableUserConfig}
     */
    const config = {
      columnDefault: {
        alignment: "center",
        width: 72,
      },
      border: {
        topBody: `─`.cyan,
        topJoin: `┬`.cyan,
        topLeft: `┌`.cyan,
        topRight: `┐`.cyan,

        bottomBody: `─`.cyan,
        bottomJoin: `┴`.cyan,
        bottomLeft: `└`.cyan,
        bottomRight: `┘`.cyan,

        bodyLeft: `│`.cyan,
        bodyRight: `│`.cyan,
        bodyJoin: `│`.cyan,

        joinBody: `─`.cyan,
        joinLeft: `├`.cyan,
        joinRight: `┤`.cyan,
        joinJoin: `┼`.cyan,
      },
      drawHorizontalLine: (lineIndex, rowCount) => {
        return lineIndex === 0 || lineIndex === rowCount;
      },
    };
    const data = [
      [""],
      [t("console:vanity.welcome", { name: colors.blue(this.pkg.name) })],
      [
        t("console:vanity.node", {
          v: colors.green(process.version),
        }),
      ],
      [
        t("console:vanity.version", {
          v: colors.yellow(this.pkg.version),
        }),
      ],
      [
        t("console:vanity.message", {
          author: colors.cyan(this.pkg.author.name),
        }),
      ],
      [""],
    ];

    console.log(vanity);
    console.log(table(data, config));
  }

  /** a function to start everything
   * @returns {Promise<void>}
   */
  async start() {
    console.clear();

    // load locales
    loadLocales();

    if (this.config.plugins.antiCrash.enabled) AntiCrash(this);

    if (this.config.console.debug.vanity) {
      this.logVanity();
    }

    // Load event modules
    await loadEvents(this, "src/events");

    // Load command modules
    await loadCommands(this, "src/commands");

    // Connect to the database
    await connectdb(this);

    // Log into the client
    await this.login(this.config.bot_token);
  }
}

module.exports = { DiscordBot };
