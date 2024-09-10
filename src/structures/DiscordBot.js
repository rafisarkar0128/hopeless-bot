const {
  Client,
  Collection,
  ActionRowBuilder,
  ButtonBuilder,
  REST,
  Routes,
} = require("discord.js");
const colors = require("colors");
const { AntiCrash } = require("../helpers/AntiCrash.js");
const { Logger } = require("../helpers/Logger.js");
const { initializeMongoose } = require("../database/connect.js");

class DiscordBot extends Client {
  /**
   * @param {import("discord.js").ClientOptions} options
   */
  constructor(options) {
    super(options);

    this.logger = new Logger(`${process.cwd()}/logs`);
    this.config = require(`${process.cwd()}/config.js`);
    this.pkg = require(`${process.cwd()}/package.json`);

    /**
     * @type {Collection<string, Promise<void>>} - Collection for events
     */
    this.events = new Collection();

    /**
     * @type {Collection<string, Collection} - Collection for command cooldowns
     */
    this.cooldowns = new Collection();

    /**
     * @type {import('./Command.js')} - Collection for prefix commands
     */
    this.commands = new Collection();

    /**
     * @type {Collection<string, import("./SlashCommand")>} - Collection for slash commands
     */
    this.slashCommands = new Collection();

    /**
     * @type {Collection<string, import('./BaseContext')>} - Collection for context menus
     */
    this.contextMenus = new Collection();

    /**
     * @type {Collection<string, Object>} - Collection for command allias other stuff
     */
    this.commandIndex = new Collection();

    /**
     * @type {Collection<string, import('@structures/Command')>}
     */
    //this.slashCommands = new Collection(); // store slash commands

    this.loadEvents = require("../loaders/loadEvents.js");
    this.loadCommands = require("../loaders/loadCommands.js");
  }

  /**
   * @param {String} text - To log text on the console
   */
  log(text) {
    this.logger.log(text);
  }

  /**
   * @param {String} text - To log warnings on the console
   */
  warn(text) {
    this.logger.warn(text);
  }

  /**
   * @param {String} text - To log errors on the console
   */
  error(text) {
    this.logger.error(text);
  }

  /**
   * @param {String} text - The text to display
   * @param {import("boxen").Options} options - Options for styling
   */
  async logBox(text, options) {
    const boxen = (await import("boxen")).default;
    if (!typeof text === "string") {
      return new TypeError(
        `Needed a text value for option text but got ${typeof text}`
      );
    }
    return console.log(boxen(text, options));
  }

  async build() {
    if (this.config.antiCrash) AntiCrash(this);

    try {
      console.clear();
      await this.logBox(
        [
          `Welcome to ${colors.blue(
            this.pkg.name.toUpperCase()
          )} github project`,
          `Running on Node.Js ${colors.green(process.version)}`,
          `Version ${colors.yellow(this.pkg.version)}`,
          `Coded with 💖 by ${colors.cyan(this.pkg.author.name)}`,
        ].join("\n"),
        {
          borderColor: "#00BFFF",
          textAlignment: "center",
          padding: {
            left: 8,
            right: 8,
            top: 1,
            bottom: 1,
          },
        }
      );
      this.login(this.config.bot.token);
      await this.loadEvents(this, `${process.cwd()}/src/events`);
      await this.loadCommands(this, `${process.cwd()}/src/commands`);
      initializeMongoose(this);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {import("discord.js").TextChannel} textChannel
   * @param {import("discord.js").VoiceChannel} voiceChannel
   */
  createPlayer(textChannel, voiceChannel) {
    return this.manager.create({
      guild: textChannel.guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: textChannel.id,
      selfDeafen: this.config.serverDeafen,
      volume: this.config.defaultVolume,
    });
  }

  createController(guild, player) {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle("DANGER")
        .setCustomId(`controller:${guild}:Stop`)
        .setEmoji("⏹️"),

      new ButtonBuilder()
        .setStyle("PRIMARY")
        .setCustomId(`controller:${guild}:Replay`)
        .setEmoji("⏮️"),

      new ButtonBuilder()
        .setStyle(player.playing ? "PRIMARY" : "DANGER")
        .setCustomId(`controller:${guild}:PlayAndPause`)
        .setEmoji(player.playing ? "⏸️" : "▶️"),

      new ButtonBuilder()
        .setStyle("PRIMARY")
        .setCustomId(`controller:${guild}:Next`)
        .setEmoji("⏭️"),

      new ButtonBuilder()
        .setStyle(
          player.trackRepeat
            ? "SUCCESS"
            : player.queueRepeat
            ? "SUCCESS"
            : "DANGER"
        )
        .setCustomId(`controller:${guild}:Loop`)
        .setEmoji(player.trackRepeat ? "🔂" : player.queueRepeat ? "🔁" : "🔁")
    );
  }
}

module.exports = { DiscordBot };
