const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const { Manager } = require("moonlink.js");
const { AntiCrash } = require("@helpers/AntiCrash");
const colors = require("colors");

class DiscordBot extends Client {
  /** Options to use while initializing the client
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    this.config = require(`@config/config.js`);
    this.colors = require(`@config/colors.json`);
    this.wait = require("timers/promises").setTimeout;
    this.database = require("@src/database/mongoose.js");
    this.pkg = require("@root/package.json");
    this.logger = new Logger(this);
    this.utils = new Utils(this);
    this.syncCommands = require("@helpers/syncCommands");

    /** @type {import("@types/types").NewCommand[]} */
    this.newCommands = new Array();

    /** @type {Collection<string, import("@types/commands").CommandStructure>} */
    this.commands = new Collection();
    /** @type {Collection<string, import("@types/commands").CommandStructure>} */
    this.slashCommands = new Collection();
    /** @type {Collection<string, string>} */
    this.aliases = new Collection();
    /** @type {Collection<string, import("@types/commands").ContextMenuStructure>} */
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

  /** Function to load event modules
   * @param {string} dirname Directory name for event files defaults to "events"
   * @return {Promise<void>}
   */
  async loadEvents(dirname = "events") {
    let debug = this.config.console.debug.event;
    if (debug) this.logger.info(`loading event modules`);
    /** @type {Array<{file: string, error: Error}>} */
    const errors = new Array();
    const files = await this.utils.loadFiles(dirname, ".js");
    let i = 0;

    for (const file of files) {
      try {
        /** @type {import("@types/events").EventStructure} */
        const event = require(file);
        const execute = (...args) => event.execute(this, ...args);
        const target = event.rest
          ? this.rest
          : event.ws
          ? this.ws
          : event.moonlink
          ? this.moonlink
          : this;

        target[event.once ? "once" : "on"](event.name, execute);

        i++;
        if (debug) {
          console.log(
            `[${colors.yellow("EVENT")}] ${colors.green(
              file.replace(/\\/g, "/").split("/").pop(),
            )}`,
          );
        }
      } catch (error) {
        if (debug) {
          console.log(
            `[${colors.yellow("EVENT")}] ${colors.red(
              file.replace(/\\/g, "/").split("/").pop(),
            )}`,
          );
        }
        errors.push({ file: file, error: error });
      }
    }

    if (errors.length > 0) {
      console.log(
        colors.yellow(
          "[AntiCrash] | [Event_Loader_Error_Logs] | [Start] : ===============",
        ),
      );
      errors.forEach((e) => {
        console.log(colors.yellow(e.file), "\n", colors.red(e.error), "\n");
      });
      console.log(
        colors.yellow(
          "[AntiCrash] | [Event_Loader_Error_Logs] | [End] : ===============",
        ),
      );
    }

    return this.logger.info(`loaded ${colors.yellow(i)} event modules`);
  }

  /** Function to load command modules
   * @param {string} dirname Directory name for command files defaults to "commands"
   * @return {Promise<void>}
   */
  async loadCommands(dirname = "commands") {
    const debug = this.config.console.debug.command;
    if (debug) this.logger.info(`loading command modules`);

    /** @type {Array<{file: string, error: Error}>} */
    const errors = new Array();
    const files = await this.utils.loadFiles(dirname, ".js");
    let typeArray = [1, 2, 3];
    this.commands.clear();

    let i = 0;
    for (const file of files) {
      try {
        /** @type {import("@types/commands").BaseCommandStructure} */
        const command = require(file);

        if (
          command?.isDisabled ||
          (command?.isPrefixDisabled && command?.isSlashDisabled)
        ) {
          continue;
        }

        if (this.config.categories[command.category]?.enabled === false) continue;

        if (command?.aliases?.length) {
          for (const alias of command.aliases) {
            if (this.aliases.has(alias)) {
              throw new Error(`alias ${colors.yellow(alias)} already exist`);
            } else {
              this.aliases.set(alias, command.data.name);
            }
          }
        }

        if (command?.isPrefixDisabled === false) {
          this.commands.set(command.data.name, command);
        }

        if (command?.isSlashDisabled === false) {
          this.slashCommands.set(command.data.name, command);
        }

        if (command?.data.type === (2 || 3)) {
          this.contexts.set(command.data.name, command);
        }

        if (command.data.toJSON()) {
          this.newCommands.push({
            data: command.data.toJSON(),
            global: command.isGlobal,
            disabled: command?.isDisabled || command?.isSlashDisabled,
          });
        }

        i++;
        if (debug) {
          console.log(
            `[${colors.blue("COMMAND")}] ${colors.green(
              file.replace(/\\/g, "/").split("/").pop(),
            )}`,
          );
        }
      } catch (error) {
        if (debug) {
          console.log(
            `[${colors.blue("COMMAND")}] ${colors.red(
              file.replace(/\\/g, "/").split("/").pop(),
            )}`,
          );
        }
        errors.push({ file: file, error: error });
      }
    }

    if (errors.length > 0) {
      console.log(
        colors.yellow(
          "[AntiCrash] | [Command_Loader_Error_Logs] | [Start] : ===============",
        ),
      );
      errors.forEach((e) => {
        console.log(colors.yellow(e.file), "\n", colors.red(e.error), "\n");
      });
      console.log(
        colors.yellow(
          "[AntiCrash] | [Command_Loader_Error_Logs] | [End] : ===============",
        ),
      );
    }

    return this.logger.info(`loaded ${colors.yellow(i)} command modules`);
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
  async build() {
    if (this.config.plugins.antiCrash.enabled) AntiCrash(this);

    console.clear();
    if (this.config.console.debug.mainLogo) {
      console.log(this.getVanity());
      console.log(await this.getLogbox());
    }

    // Load event modules
    await this.loadEvents("events");

    // Load command modules
    await this.loadCommands("commands");

    // Connect to the database
    await this.database.connect(this);

    // Log into the client
    await this.login(this.config.bot_token);
  }
}

module.exports = { DiscordBot };
