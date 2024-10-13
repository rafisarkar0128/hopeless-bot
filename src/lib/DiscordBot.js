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
        console.log(colors.yellow(e.file), "\n", colors.red(e.error));
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
  async loadCommands(dirname) {
    const debug = this.config.console.debug.command;
    if (debug) this.logger.info(`loading command modules`);

    /** @type {Array<{file: string, error: Error}>} */
    const errors = new Array();
    const files = await this.utils.loadFiles(dirname, ".js");
    this.commands.clear();

    for (const file of files) {
      try {
        /** @type {import("@types/commands").CommandStructure} */
        const command = require(file);
        const { name, prefixCommand, slashCommand, category } = command;

        if (!prefixCommand.enabled && !slashCommand.enabled) continue;
        if (this.config.categories[category]?.enabled === false) continue;

        if (prefixCommand.aliases?.length) {
          for (const alias of prefixCommand.aliases) {
            if (this.aliases.has(alias)) {
              throw new Error(`alias ${colors.yellow(alias)} already exist`);
            } else {
              this.aliases.set(alias, name);
            }
          }
        }

        this.commands.set(name, command);

        this.newCommands.push({
          data: slashCommand.data.toJSON(),
          global: command.isGlobal,
          enabled: slashCommand.enabled,
        });

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
        console.log(colors.yellow(e.file), "\n", colors.red(e.error));
      });
      console.log(
        colors.yellow(
          "[AntiCrash] | [Command_Loader_Error_Logs] | [End] : ===============",
        ),
      );
    }

    return this.logger.info(
      `loaded ${colors.yellow(this.commands.size)} command modules`,
    );
  }

  /**
   * @param {String} content - The text to display (must be a string)
   * @param {import("boxen").Options} options - Options for styling
   * @return {Promise<void>}
   */
  async logBox(content, options) {
    const boxen = (await import("boxen")).default;
    console.log(boxen(content, options));
  }

  /** a function to start everything
   * @returns {Promise<void>}
   */
  async build() {
    if (this.config.plugins.antiCrash.enabled) AntiCrash(this);

    console.clear();
    if (this.config.console.debug.mainLogo) {
      await this.logBox(
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
