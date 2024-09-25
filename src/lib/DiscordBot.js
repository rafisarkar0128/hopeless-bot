const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const colors = require("colors");
const commandCategories = require("@src/commandCategories.js");
const syncCommands = require("@helpers/syncCommands");

class DiscordBot extends Client {
    /** Client Options to use while initializing the this
     * @param {import("discord.js").ClientOptions} options
     */
    constructor(options) {
        super(options);

        this.config = require(`@src/config.js`);
        this.colors = require(`@src/colors.json`);
        this.wait = require("timers/promises").setTimeout;
        this.database = require("@src/database/mongoose.js");
        this.logger = new Logger(this);
        this.utils = new Utils(this);

        /** @type {Collection<string, import("../index").EventStructure>} */
        this.events = new Collection();
        /** @type {Collection<string, import("../index").CommandStructure>} */
        this.commands = new Collection();
        /** @type {Collection<string, string>} */
        this.aliases = new Collection();
        /** @type {Collection<string, new Collection(string, number)>} */
        this.cooldowns = new Collection();

        // store (alias, arrayIndex) pair
        //this.commandIndex = new Collection();

        // Music Player
        //if (this.config.music.enabled) this.musicManager = lavaclient(this);

        // Giveaways
        //if (this.config.giveaways.enabled) this.giveawaysManager = giveawaysHandler(this);

        // Discord Together
        //this.discordTogether = new DiscordTogether(this);
    }

    /** Function to load event modules
     * @param {string} dirname Directory name of events
     * @return {Promise<void>}
     */
    async loadEvents(dirname = "events") {
        this.logger.info(`started to load event modules`);
        const files = await this.utils.loadFiles(dirname, ".js");
        this.events.clear();
        for (const file of files) {
            try {
                const event = require(file);
                const execute = (...args) => event.execute(this, ...args);
                const target = event.rest ? this.rest : this;

                this.events.set(file.replace(/\\/g, "/").split("/").pop(), event);
                console.log(
                    `[${colors.yellow("EVENT")}] ${colors.cyan("loaded")} ${colors.green(
                        file.replace(/\\/g, "/").split("/").pop(),
                    )}`,
                );
                target[event.once ? "once" : "on"](event.name, execute);
            } catch (error) {
                this.utils.sendError(error, "event", {
                    origin: "src/lib/DiscordBot.js",
                });
                throw error;
            }
        }
        this.logger.info(`loaded ${colors.yellow(this.events.size)} event modules`);
    }

    /** Function to load command modules
     * @param {string} dirname Directory name of commands
     * @return {Promise<void>}
     */
    async loadCommands(dirname) {
        this.logger.info(colors.cyan(`started to load command modules`));
        const ApplicationCommands = {
            globalCommands: new Array(),
            guildCommands: new Array(),
        };
        const files = await this.utils.loadFiles(dirname, ".js");
        this.commands.clear();

        for (const file of files) {
            try {
                /** @type {import("@src/index").CommandStructure} */
                const command = require(file);

                if (command.category) {
                    if (commandCategories[command.category]?.enabled === false) continue;
                }

                if (command.cooldown) {
                    this.cooldowns.set(command.data.name, new Collection());
                }

                if (command.aliases?.length) {
                    for (const alias of command.aliases) {
                        this.aliases.set(alias, command.data.name);
                    }
                }

                this.commands.set(command.data.name, command);
                console.log(
                    `[${colors.blue("COMMAND")}] ${colors.cyan("loaded")} ${colors.green(
                        command.data.name,
                    )}`,
                );

                if (command?.data) {
                    if (command.global) {
                        ApplicationCommands.globalCommands.push(command.data.toJSON());
                    } else {
                        ApplicationCommands.guildCommands.push(command.data.toJSON());
                    }
                }
            } catch (error) {
                throw error;
            }
        }

        this.logger.info(
            colors.cyan(`loaded ${colors.yellow(this.commands.size)} command modules`),
        );

        return syncCommands(this, ApplicationCommands);
    }

    /**
     * @param {String} content - The text to display (must be a string)
     * @param {import("boxen").Options} options - Options for styling
     */
    async logBox(content, options) {
        const boxen = (await import("boxen")).default;
        return console.log(boxen(content, options));
    }
}

module.exports = { DiscordBot };
