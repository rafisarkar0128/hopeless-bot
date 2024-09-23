const { Client, Collection, Routes } = require("discord.js");
const { Colors, ColorArray } = require(`@src/colors.json`);
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const colors = require("colors");
const path = require("path");

class DiscordBot extends Client {
    /** Client Options to use while intializing the this
     * @param {import("discord.js").ClientOptions} options
     */
    constructor(options) {
        super(options);

        this.config = require(`@src/config.js`);
        this.colors = Colors;
        this.colors.array = ColorArray;
        this.wait = require("timers/promises").setTimeout;
        this.database = require("@src/database/mongoose.js");
        this.logger = new Logger(this);
        this.utils = new Utils(this);
        this.getCommands = require("@helpers/getCommands");
        this.fetchApplicationCommands = require("@helpers/fetchSlashCommands");

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
        const files = await this.utils.loadFiles(dirname, ".js");
        this.events.clear();
        for (const file of files) {
            try {
                const event = require(file);
                const execute = (...args) => event.execute(this, ...args);
                const target = event.rest ? this.rest : this;

                this.events.set(file.replace(/\\/g, "/").split("/").pop(), event);
                target[event.once ? "once" : "on"](event.name, execute);
            } catch (error) {
                this.utils.sendError(error, {
                    origin: "src/lib/DiscordBot.js",
                    type: "event",
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
        const { Commands, ApplicationCommands } = await this.getCommands(this, dirname);
        this.commands.clear();

        Commands.forEach(
            /** @param {import("@src/index").CommandStructure} command */
            async (command) => {
                try {
                    if (command.enabled === false) return;
                    if (command.cooldown) {
                        this.cooldowns.set(command.data.name, new Collection());
                    }

                    if (command.aliases?.length) {
                        for (const alias of command.aliases) {
                            this.aliases.set(alias, command.data.name);
                        }
                    }

                    this.commands.set(command.data.name, command);
                } catch (error) {
                    throw error;
                }
            },
        );

        this.logger.info(
            colors.blue(`loaded ${colors.yellow(this.commands.size)} command module`),
        );

        this.logger.info(
            colors.yellow("🔎 Checking for changes in Application Commands"),
        );
        this.logger.write(colors.gray("📩 Fetching slash commands from discord"));
        const fCommands = await this.fetchApplicationCommands(this);
        await this.wait(2000);
        this.logger.log(
            colors.blue(
                `📦 Found ${colors.yellow(fCommands.length)} application commands`,
            ),
        );

        this.rest.put(
            Routes.applicationGuildCommands(this.config.bot.id, this.config.serverId),
            {
                body: ApplicationCommands,
            },
        );
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
