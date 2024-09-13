const {
  Client,
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { Logger } = require("./Logger.js");
const colors = require("colors");
const { glob } = require("glob");
const path = require("path");
const pkg = require("../../package.json");

class DiscordBot extends Client {
  /**
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    this.logger = new Logger();
    this.config = require(`../config.js`);
    this.colors = require(`../colors.json`);

    /**
     * @type {Collection<string, Collection} - Collection for command cooldowns
     */
    this.cooldowns = new Collection();

    /**
     * @type {import('../../collected/Command.js')} - Collection for prefix commands
     */
    this.commands = new Collection();

    /**
     * @type {Collection<string, import("../../collected/SlashCommand.js")>} - Collection for slash commands
     */
    this.slashCommands = new Collection();

    /**
     * @type {Collection<string, import('../Collected/BaseContext.js')>} - Collection for context menus
     */
    this.contextMenus = new Collection();

    /**
     * @type {Collection<string, Object>} - Collection for command allias other stuff
     */
    this.commandIndex = new Collection();

    //**
    // * @type {Collection<string, import('@structures/Command')>}
    // */
    //this.slashCommands = new Collection(); // store slash commands

    this.loadCommands = require("../loaders/loadCommands.js");
  }

  /**
   * @param {String} dir - Path to the files directory
   */
  async loadFiles(dir) {
    const deleteCashedFile = (file) => {
      const filePath = path.resolve(file);
      if (require.cache[filePath]) {
        delete require.cache[filePath];
      }
    };

    const files = await glob(path.join(dir, `**/*.js`).replace(/\\/g, "/"));
    const jsFiles = files.filter((file) => path.extname(file) === ".js");
    await Promise.all(jsFiles.map(deleteCashedFile));
    return jsFiles;
  }

  /**
   *@param {String} dir - path of events directory
   */
  async loadEvents(dir) {
    const files = await this.loadFiles(`${process.cwd()}/src/events`);

    let i = 0;
    for (const file of files) {
      try {
        const event = require(file);
        const execute = (...args) => event.execute(this, ...args);
        const target = event.rest ? this.rest : this;

        target[event.once ? "once" : "on"](event.name, execute);

        i++;
      } catch (error) {
        this.logger.error(error);
      }
    }

    this.logger.log(colors.yellow(`loaded ${i} events.`));
  }

  /**
   * @param {String} text - The text to display
   * @param {import("boxen").Options} options - Options for styling
   */
  async logBox() {
    const boxen = (await import("boxen")).default;
    return console.log(
      boxen(
        [
          `Welcome to ${colors.blue(pkg.name.toUpperCase())} github project`,
          `Running on Node.Js ${colors.green(process.version)}`,
          `Version ${colors.yellow(pkg.version)}`,
          `Coded with 💖 by ${colors.cyan(pkg.author.name)}`,
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
        }
      )
    );
  }
}

module.exports = { DiscordBot };
