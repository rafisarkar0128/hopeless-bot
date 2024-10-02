const { Client, Collection } = require("discord.js");
const { Logger } = require("@lib/Logger.js");
const { Utils } = require("@lib/Utils.js");
const colors = require("colors");
const commandCategories = require("@src/commandCategories.js");
const { syncCommands } = require("@helpers/syncCommands");

class DiscordBot extends Client {
    /** Client Options to use while initializing the client
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

        /** @type {import("@src/index").EventCollection} */
        this.events = new Collection();
        /** @type {import("@src/index").CommandCollection} */
        this.commands = new Collection();
        /** @type {import("@src/index").AliasCollection} */
        this.aliases = new Collection();
        /** @type {import("@src/index").CooldownCollection} */
        this.cooldowns = new Collection();
        /** @type {import("@src/index").ContextCollection} */
        this.contexts = new Collection();

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
        this.logger.info(`loading event modules`);
        const errors = new Array();

        const files = await this.utils.loadFiles(dirname, ".js");
        this.events.clear();

        for (const file of files) {
            try {
                const event = require(file);
                const execute = (...args) => event.execute(this, ...args);
                const target = event.rest ? this.rest : this;

                this.events.set(file.replace(/\\/g, "/").split("/").pop(), event);
                console.log(
                    `[${colors.yellow("EVENT")}] ${colors.green(
                        file.replace(/\\/g, "/").split("/").pop(),
                    )}`,
                );

                target[event.once ? "once" : "on"](event.name, execute);
            } catch (error) {
                console.log(
                    `[${colors.yellow("EVENT")}] ${colors.red(
                        file.replace(/\\/g, "/").split("/").pop(),
                    )}`,
                );
                errors.push(error);
            }
        }

        if (errors.length > 0) {
            console.log(
                colors.yellow(
                    "[AntiCrash] | [Event_Error_Logs] | [Start] : ===============",
                ),
            );
            errors.forEach((error) => {
                console.log(colors.red(error));
            });
            console.log(
                colors.yellow(
                    "[AntiCrash] | [Event_Error_Logs] | [End] : ===============",
                ),
            );
        }

        return this.logger.info(
            `loaded ${colors.yellow(this.events.size)} event modules`,
        );
    }

    /** Function to load command modules
     * @param {string} dirname Directory name of commands
     * @return {Promise<void>}
     */
    async loadCommands(dirname) {
        this.logger.info(`loading command modules`);
        const errors = new Array();

        /** @type {import("@src/index").NewCommand} */
        const newCommands = new Array();
        const files = await this.utils.loadFiles(dirname, ".js");
        this.commands.clear();

        for (const file of files) {
            try {
                /** @type {import("@src/index").CommandStructure} */
                const command = require(file);

                if (
                    command.disabled === true ||
                    (command.disabled.slash && command.disabled.prefix)
                ) {
                    continue;
                }

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

                if (command.data.toJSON().type === 1) {
                    this.commands.set(command.data.name, command);
                    newCommands.push({
                        data: command.data.toJSON(),
                        global: command?.global,
                        disabled: command.disabled.slash,
                    });
                } else {
                    this.contexts.set(command.data.name, command);
                    newCommands.push({
                        data: command.data.toJSON(),
                        global: command?.global,
                        disabled: command.disabled,
                    });
                }

                console.log(
                    `[${colors.blue("COMMAND")}] ${colors.green(
                        file.replace(/\\/g, "/").split("/").pop(),
                    )}`,
                );
            } catch (error) {
                console.log(
                    `[${colors.blue("COMMAND")}] ${colors.red(
                        file.replace(/\\/g, "/").split("/").pop(),
                    )}`,
                );
                errors.push(error);
            }
        }

        if (errors.length > 0) {
            console.log(
                colors.yellow(
                    "[AntiCrash] | [Command_Error_Logs] | [Start] : ===============",
                ),
            );
            errors.forEach((error) => {
                console.log(colors.red(error));
            });
            console.log(
                colors.yellow(
                    "[AntiCrash] | [Command_Error_Logs] | [End] : ===============",
                ),
            );
        }

        this.logger.info(
            `loaded ${colors.yellow(
                this.commands.size + this.contexts.size,
            )} command modules`,
        );

        return await syncCommands(this, newCommands);
    }

    /**
     * @param {String} content - The text to display (must be a string)
     * @param {import("boxen").Options} options - Options for styling
     * @return {Promise<void>}
     */
    async logBox(content, options) {
        const boxen = (await import("boxen")).default;
        return console.log(boxen(content, options));
    }
}

module.exports = { DiscordBot };
