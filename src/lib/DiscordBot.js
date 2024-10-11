const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const { Manager } = require("moonlink.js");
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
    if (this.config.console.loaders.event) this.logger.info(`loading event modules`);
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
        if (this.config.console.loaders.event) {
          console.log(
            `[${colors.yellow("EVENT")}] ${colors.green(
              file.replace(/\\/g, "/").split("/").pop(),
            )}`,
          );
        }
      } catch (error) {
        console.log(
          `[${colors.yellow("EVENT")}] ${colors.red(
            file.replace(/\\/g, "/").split("/").pop(),
          )}`,
        );
        errors.push({ file: file, error: error });
      }
    }

    if (errors.length > 0) {
      console.log(
        colors.yellow("[AntiCrash] | [Event_Error_Logs] | [Start] : ==============="),
      );
      errors.forEach((e) => {
        console.log(colors.yellow(e.file), "\n", colors.red(e.error));
      });
      console.log(
        colors.yellow("[AntiCrash] | [Event_Error_Logs] | [End] : ==============="),
      );
    }

    return this.logger.info(`loaded ${colors.yellow(i)} event modules`);
  }

  /** Function to load command modules
   * @param {string} dirname Directory name for command files defaults to "commands"
   * @return {Promise<void>}
   */
  async loadCommands(dirname) {
    if (this.config.console.loaders.command) this.logger.info(`loading command modules`);
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

        if (this.config.console.loaders.command) {
          console.log(
            `[${colors.blue("COMMAND")}] ${colors.green(
              file.replace(/\\/g, "/").split("/").pop(),
            )}`,
          );
        }
      } catch (error) {
        console.log(
          `[${colors.blue("COMMAND")}] ${colors.red(
            file.replace(/\\/g, "/").split("/").pop(),
          )}`,
        );
        errors.push({ file: file, error: error });
      }
    }

    if (errors.length > 0) {
      console.log(
        colors.yellow("[AntiCrash] | [Command_Error_Logs] | [Start] : ==============="),
      );
      errors.forEach((e) => {
        console.log(colors.yellow(e.file), "\n", colors.red(e.error));
      });
      console.log(
        colors.yellow("[AntiCrash] | [Command_Error_Logs] | [End] : ==============="),
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
}

module.exports = { DiscordBot };
