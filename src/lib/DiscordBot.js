const { Client, Collection } = require("discord.js");
const colors = require("colors");
const { Colors, ColorArray } = require(`../colors.json`);
const { Logger } = require("../helpers/Logger.js");
const { Utils } = require("../helpers/utils.js");

class DiscordBot extends Client {
    /**
     * @param {import("discord.js").ClientOptions} options
     */
    constructor(options) {
        super(options);

        this.config = require(`../config.js`);
        this.pkg = require("../../package.json");
        this.colors = Colors;
        this.colors.array = ColorArray;
        this.wait = require("timers/promises").setTimeout;
        this.database = require("../database/mongoose.js");
        this.logger = new Logger(this);
        this.utils = new Utils(this);
        this.loadCommands = require("../helpers/loadCommands.js");

        /** @type {Collection<string, import("../index").EventStructure>} */
        this.events = new Collection();
        /** @type {Collection<string, import("../index").CommandStructure>} */
        this.commands = new Collection();
        /** @type {Collection<string, new Collection(string, number)>} */
        this.cooldowns = new Collection();
    }

    /**
     *@param {string} dirname - Name to event files directory
     */
    async loadEvents(dirname) {
        const files = await this.utils.loadFiles(dirname);
        this.events.clear();
        for (const file of files) {
            try {
                const event = require(file);
                const execute = (...args) => event.execute(this, ...args);
                const target = event.rest ? this.rest : this;

                this.events.set(
                    file.replace(/\\/g, "/").split("/").pop(),
                    event,
                );
                target[event.once ? "once" : "on"](event.name, execute);
            } catch (error) {
                this.utils.sendError(error, {
                    origin: "src/lib/DiscordBot.js",
                    type: "event",
                });
                throw error;
            }
        }
        return this.logger.info(
            `loaded ${colors.yellow(this.events.size)} event modules`,
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

    async startBot() {
        try {
            console.clear();
            await this.logBox(
                [
                    `Welcome to ${colors.blue(
                        this.pkg.name.toUpperCase(),
                    )} github project`,
                    `Running on Node.Js ${colors.green(process.version)}`,
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

            await this.loadEvents("events");
            await this.login(this.config.bot.token);
            await this.database.connect(this);
            this.loadCommands(this, { dirname: "commands" });
        } catch (error) {
            this.utils.sendError(error, {
                origin: "src/lib/DiscordBot.js",
                type: "internal",
            });
            throw error;
        }
    }
}

module.exports = { DiscordBot };
