const {
    Client,
    Collection,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ApplicationCommandType,
    REST,
    Routes,
} = require("discord.js");
const { glob } = require("glob");
const path = require("path");
const colors = require("colors");
const { AntiCrash } = require("../helpers/AntiCrash.js");
const { DateTime } = require("luxon");
const { Logger } = require("../helpers/Logger.js");
const { table, createStream } = require("table");
const { initializeMongoose, schemas } = require("../database/connect.js");
//const { recursiveReadDirSync } = require("../helpers/Utils");
//const { validateCommand, validateContext } = require("../helpers/Validator");
//const CommandCategory = require("./CommandCategory");
//const lavaclient = require("../handlers/lavaclient");
//const giveawaysHandler = require("../handlers/giveaway");
//const { DiscordTogether } = require("discord-together");

//const escapeMarkdown = require("discord.js").Util.escapeMarkdown;
//const prettyMilliseconds = require("pretty-ms");
//const spotify = require("better-erela.js-spotify").default;
//const { default: AppleMusic } = require("better-erela.js-apple");
//const deezer = require("erela.js-deezer");
//const facebook = require("erela.js-facebook");
//const Server = require("../api");
//const getLavalink = require("../util/getLavalink");
//const getChannel = require("../util/getChannel");
//const colors = require("colors");
//const filters = require("erela.js-filters");
//const { default: EpicPlayer } = require("./EpicPlayer");

class DiscordBot extends Client {
    /**
     *
     * @param {import("discord.js").ClientOptions} options
     */
    constructor(options) {
        super(options);

        this.logger = new Logger(`${process.cwd()}/logs`);
        this.config = require(`${process.cwd()}/config.js`);
        this.colors = require(`${process.cwd()}/colors.json`);
        this.pkg = require(`${process.cwd()}/package.json`);
        this.events = new Collection();
        this.cooldowns = new Collection();

        /**@type {Collection<string, import("./SlashCommand")} */
        this.slashCommands = new Collection();
        this.contextCommands = new Collection();

        /**
         * @type {Collection<string, import('@structures/Command')>}
         */
        this.slashCommands = new Collection(); // store slash commands

        /**
         * @type {Collection<string, import('@structures/BaseContext')>}
         */
        this.contextMenus = new Collection(); // store contextMenus

        /**
         * @type {import('@structures/Command')[]}
         */
        this.commands = []; // store actual command
        this.commandIndex = new Collection(); // store (alias, arrayIndex) pair

        //this.deletedMessages = new WeakSet();
        //this.getLavalink = getLavalink;
        //this.getChannel = getChannel;
        //this.ms = prettyMilliseconds;
        //this.commandsRan = 0;
        //this.songsPlayed = 0;

        //this.counterUpdateQueue = []; // store guildId's that needs counter update

        //if (this.config.music.enabled) this.musicManager = lavaclient(this);

        //if (this.config.giveaway.enabled) {
        //  this.giveawaysManager = giveawaysHandler(this);
        //}

        //this.discordTogether = new DiscordTogether(this);

        this.build();
    }

    /**
     * @param {String} string
     */
    log(string) {
        this.logger.log(string);
    }

    /**
     * @param {String} string
     */
    warn(string) {
        this.logger.warn(string);
    }

    /**
     * @param {String} string
     */
    error(string) {
        this.logger.error(string);
    }

    /**
     * @param {String} string
     */
    debug(string) {
        this.logger.debug(string);
    }

    /**
     *
     * @param {Array} Array
     */
    table(Array) {}

    /**
     *
     * @param {String} string
     * @param {Object} options
     * @returns
     */
    async logBox(string, options) {
        const boxen = await import("boxen");
        if (!typeof string === "string" || !typeof options === "object") return;
        console.log(boxen.default(string, options));
    }

    /**
     *@param {String} dir
     */
    async loadJSFiles(dir) {
        function deleteCashedFile(file) {
            const filePath = path.resolve(file);
            if (require.cache[filePath]) {
                delete require.cache[filePath];
            }
        }

        const files = await glob(path.join(dir, `**/*.js`).replace(/\\/g, "/"));
        const jsFiles = files.filter((file) => path.extname(file) === ".js");
        await Promise.all(jsFiles.map(deleteCashedFile));
        return jsFiles;
    }

    async loadEvents() {
        const files = await this.loadJSFiles(`${process.cwd()}/src/events`);
        this.events.clear();

        let i = 0;
        for (const file of files) {
            const eventObject = require(file);
            const execute = (...args) => eventObject.execute(this, ...args);
            const target = eventObject.rest ? this.rest : this;

            this.events.set(eventObject.name, execute);
            target[eventObject.once ? "once" : "on"](eventObject.name, execute);

            i++;
        }

        this.log(colors.yellow(` | loaded ${i} events.`));
    }

    async loadCommands() {
        const rest = new REST({ version: 10 }).setToken(this.config.bot.token);
        const files = await this.loadJSFiles(`${process.cwd()}/src/commands`);
        const applicationCommands = [];
        this.slashCommands.clear();

        let i = 0;
        for (const file of files) {
            const object = require(file);

            if (object.enabled) continue;
            if (object.cooldown) {
                this.cooldowns.set(object.data?.name, new Collection());
            }

            applicationCommands.push(object.data);
            this.slashCommands.set(object.data.name, object);
            i++;
        }

        rest.put(Routes.applicationCommands(this.config.bot.id), {
            body: applicationCommands,
        });
        this.log(colors.blue(` | loaded ${i} commands.`));
    }

    async build() {
        if (this.config.antiCrash) AntiCrash(this);

        try {
            console.clear();
            await this.logBox(
                [
                    `Welcome to ${colors.blue(
                        this.pkg.name.toUpperCase()
                    )} project on github`,
                    `Right now running on Node.Js ${colors.green(
                        process.version
                    )}`,
                    `Currently bot's version ${colors.yellow(
                        this.pkg.version
                    )}`,
                    `Coded by ${colors.cyan.italic(this.pkg.author.name)}`,
                ].join("\n"),
                {
                    borderColor: "#00BFFF",
                    stringAlignment: "center",
                    padding: {
                        left: 10,
                        right: 10,
                        top: 1,
                        bottom: 1,
                    },
                }
            );
            await this.loadEvents();
            await this.loadCommands();
            initializeMongoose(this);
            this.login(this.config.bot.token);
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
                .setEmoji(
                    player.trackRepeat ? "🔂" : player.queueRepeat ? "🔁" : "🔁"
                )
        );
    }
}

module.exports = class BotClient extends Client {
    /**
     * Find command matching the invoke
     * @param {string} invoke
     * @returns {import('@structures/Command')|undefined}
     */
    getCommand(invoke) {
        const index = this.commandIndex.get(invoke.toLowerCase());
        return index !== undefined ? this.commands[index] : undefined;
    }

    /**
     * Register command file in the client
     * @param {import("@structures/Command")} cmd
     */
    loadCommand(cmd) {
        // Check if category is disabled
        if (cmd.category && CommandCategory[cmd.category]?.enabled === false) {
            this.logger.debug(
                `Skipping Command ${cmd.name}. Category ${cmd.category} is disabled`
            );
            return;
        }
        // Prefix Command
        if (cmd.command?.enabled) {
            const index = this.commands.length;
            if (this.commandIndex.has(cmd.name)) {
                throw new Error(`Command ${cmd.name} already registered`);
            }
            if (Array.isArray(cmd.command.aliases)) {
                cmd.command.aliases.forEach((alias) => {
                    if (this.commandIndex.has(alias))
                        throw new Error(`Alias ${alias} already registered`);
                    this.commandIndex.set(alias.toLowerCase(), index);
                });
            }
            this.commandIndex.set(cmd.name.toLowerCase(), index);
            this.commands.push(cmd);
        } else {
            this.logger.debug(`Skipping command ${cmd.name}. Disabled!`);
        }

        // Slash Command
        if (cmd.slashCommand?.enabled) {
            if (this.slashCommands.has(cmd.name))
                throw new Error(`Slash Command ${cmd.name} already registered`);
            this.slashCommands.set(cmd.name, cmd);
        } else {
            this.logger.debug(`Skipping slash command ${cmd.name}. Disabled!`);
        }
    }

    /**
     * Load all commands from the specified directory
     * @param {string} directory
     */
    loadCommands(directory) {
        this.logger.log(`Loading commands...`);
        const files = recursiveReadDirSync(directory);
        for (const file of files) {
            try {
                const cmd = require(file);
                if (typeof cmd !== "object") continue;
                validateCommand(cmd);
                this.loadCommand(cmd);
            } catch (ex) {
                this.logger.error(
                    `Failed to load ${file} Reason: ${ex.message}`
                );
            }
        }

        this.logger.success(`Loaded ${this.commands.length} commands`);
        this.logger.success(`Loaded ${this.slashCommands.size} slash commands`);
        if (this.slashCommands.size > 100)
            throw new Error("A maximum of 100 slash commands can be enabled");
    }

    /**
     * Load all contexts from the specified directory
     * @param {string} directory
     */
    loadContexts(directory) {
        this.logger.log(`Loading contexts...`);
        const files = recursiveReadDirSync(directory);
        for (const file of files) {
            try {
                const ctx = require(file);
                if (typeof ctx !== "object") continue;
                validateContext(ctx);
                if (!ctx.enabled)
                    return this.logger.debug(
                        `Skipping context ${ctx.name}. Disabled!`
                    );
                if (this.contextMenus.has(ctx.name))
                    throw new Error(`Context already exists with that name`);
                this.contextMenus.set(ctx.name, ctx);
            } catch (ex) {
                this.logger.error(
                    `Failed to load ${file} Reason: ${ex.message}`
                );
            }
        }

        const userContexts = this.contextMenus.filter(
            (ctx) => ctx.type === "USER"
        ).size;
        const messageContexts = this.contextMenus.filter(
            (ctx) => ctx.type === "MESSAGE"
        ).size;

        if (userContexts > 3)
            throw new Error("A maximum of 3 USER contexts can be enabled");
        if (messageContexts > 3)
            throw new Error("A maximum of 3 MESSAGE contexts can be enabled");

        this.logger.success(`Loaded ${userContexts} USER contexts`);
        this.logger.success(`Loaded ${messageContexts} MESSAGE contexts`);
    }

    /**
     * Register slash command on startup
     * @param {string} [guildId]
     */
    async registerInteractions(guildId) {
        const toRegister = [];

        // filter slash commands
        if (this.config.INTERACTIONS.SLASH) {
            this.slashCommands
                .map((cmd) => ({
                    name: cmd.name,
                    description: cmd.description,
                    type: ApplicationCommandType.ChatInput,
                    options: cmd.slashCommand.options,
                }))
                .forEach((s) => toRegister.push(s));
        }

        // filter contexts
        if (this.config.INTERACTIONS.CONTEXT) {
            this.contextMenus
                .map((ctx) => ({
                    name: ctx.name,
                    type: ctx.type,
                }))
                .forEach((c) => toRegister.push(c));
        }

        // Register GLobally
        if (!guildId) {
            await this.application.commands.set(toRegister);
        }

        // Register for a specific guild
        else if (guildId && typeof guildId === "string") {
            const guild = this.guilds.cache.get(guildId);
            if (!guild) {
                this.logger.error(
                    `Failed to register interactions in guild ${guildId}`,
                    new Error("No matching guild")
                );
                return;
            }
            await guild.commands.set(toRegister);
        }

        // Throw an error
        else {
            throw new Error(
                "Did you provide a valid guildId to register interactions"
            );
        }

        this.logger.success("Successfully registered interactions");
    }

    /**
     * @param {string} search
     * @param {Boolean} exact
     */
    async resolveUsers(search, exact = false) {
        if (!search || typeof search !== "string") return [];
        const users = [];

        // check if userId is passed
        const patternMatch = search.match(/(\d{17,20})/);
        if (patternMatch) {
            const id = patternMatch[1];
            const fetched = await this.users
                .fetch(id, { cache: true })
                .catch(() => {}); // check if mentions contains the ID
            if (fetched) {
                users.push(fetched);
                return users;
            }
        }

        // check if exact tag is matched in cache
        const matchingTags = this.users.cache.filter(
            (user) => user.tag === search
        );
        if (exact && matchingTags.size === 1) users.push(matchingTags.first());
        else matchingTags.forEach((match) => users.push(match));

        // check matching username
        if (!exact) {
            this.users.cache
                .filter(
                    (x) =>
                        x.username === search ||
                        x.username
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        x.tag.toLowerCase().includes(search.toLowerCase())
                )
                .forEach((user) => users.push(user));
        }

        return users;
    }

    /**
     * Get bot's invite
     */
    getInvite() {
        return this.generateInvite({
            scopes: ["bot", "applications.commands"],
            permissions: [
                "AddReactions",
                "AttachFiles",
                "BanMembers",
                "ChangeNickname",
                "Connect",
                "DeafenMembers",
                "EmbedLinks",
                "KickMembers",
                "ManageChannels",
                "ManageGuild",
                "ManageMessages",
                "ManageNicknames",
                "ManageRoles",
                "ModerateMembers",
                "MoveMembers",
                "MuteMembers",
                "PrioritySpeaker",
                "ReadMessageHistory",
                "SendMessages",
                "SendMessagesInThreads",
                "Speak",
                "ViewChannel",
            ],
        });
    }
};

class DiscordMusicBot extends Client {
    /**
     * Build em
     */
    build() {
        this.warn("Started the bot...");
        this.login(this.config.token);
        this.server = this.config.website?.length ? new Server(this) : null; // constructing also starts it; Do not start server when no website configured
        if (this.config.debug === true) {
            this.warn("Debug mode is enabled!");
            this.warn("Only enable this if you know what you are doing!");
            process.on("unhandledRejection", (error) => console.log(error));
            process.on("uncaughtException", (error) => console.log(error));
        } else {
            process.on("unhandledRejection", (error) => {
                return;
            });
            process.on("uncaughtException", (error) => {
                return;
            });
        }

        let client = this;

        /**
         * will hold at most 100 tracks, for the sake of autoqueue
         */
        let playedTracks = [];

        this.manager = new Manager({
            plugins: [
                new deezer(),
                new AppleMusic(),
                new spotify(),
                new facebook(),
                new filters(),
            ],
            autoPlay: true,
            nodes: this.config.nodes,
            retryDelay: this.config.retryDelay,
            retryAmount: this.config.retryAmount,
            clientName: `DiscordMusic/v${
                require("../package.json").version
            } (Bot: ${this.config.clientId})`,
            send: (id, payload) => {
                let guild = client.guilds.cache.get(id);
                if (guild) {
                    guild.shard.send(payload);
                }
            },
        })
            .on("nodeConnect", (node) =>
                this.log(
                    `Node: ${node.options.identifier} | Lavalink node is connected.`
                )
            )
            .on("nodeReconnect", (node) =>
                this.warn(
                    `Node: ${node.options.identifier} | Lavalink node is reconnecting.`
                )
            )
            .on("nodeDestroy", (node) =>
                this.warn(
                    `Node: ${node.options.identifier} | Lavalink node is destroyed.`
                )
            )
            .on("nodeDisconnect", (node) =>
                this.warn(
                    `Node: ${node.options.identifier} | Lavalink node is disconnected.`
                )
            )
            .on("nodeError", (node, err) => {
                this.warn(
                    `Node: ${node.options.identifier} | Lavalink node has an error: ${err.message}.`
                );
            })
            // on track error warn and create embed
            .on("trackError", (player, err) => {
                this.warn(
                    `Player: ${player.options.guild} | Track had an error: ${err.message}.`
                );
                //console.log(err);
                let song = player.queue.current;
                var title = escapeMarkdown(song.title);
                var title = title.replace(/\]/g, "");
                var title = title.replace(/\[/g, "");

                let errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Playback error!")
                    .setDescription(`Failed to load track: \`${title}\``)
                    .setFooter({
                        text: "Oops! something went wrong but it's not your fault!",
                    });
                client.channels.cache
                    .get(player.textChannel)
                    .send({ embeds: [errorEmbed] });
            })

            .on("trackStuck", (player, err) => {
                this.warn(`Track has an error: ${err.message}`);
                //console.log(err);
                let song = player.queue.current;
                var title = escapeMarkdown(song.title);
                var title = title.replace(/\]/g, "");
                var title = title.replace(/\[/g, "");

                let errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("Track error!")
                    .setDescription(`Failed to load track: \`${title}\``)
                    .setFooter({
                        text: "Oops! something went wrong but it's not your fault!",
                    });
                client.channels.cache
                    .get(player.textChannel)
                    .send({ embeds: [errorEmbed] });
            })
            .on("playerMove", (player, oldChannel, newChannel) => {
                const guild = client.guilds.cache.get(player.guild);
                if (!guild) {
                    return;
                }
                const channel = guild.channels.cache.get(player.textChannel);
                if (oldChannel === newChannel) {
                    return;
                }
                if (newChannel === null || !newChannel) {
                    if (!player) {
                        return;
                    }
                    if (channel) {
                        channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setDescription(
                                        `Disconnected from <#${oldChannel}>`
                                    ),
                            ],
                        });
                    }
                    return player.destroy();
                } else {
                    player.voiceChannel = newChannel;
                    setTimeout(() => player.pause(false), 1000);
                    return undefined;
                }
            })
            .on("playerCreate", (player) => {
                player.set("twentyFourSeven", client.config.twentyFourSeven);
                player.set("autoQueue", client.config.autoQueue);
                player.set("autoPause", client.config.autoPause);
                player.set("autoLeave", client.config.autoLeave);
                this.warn(
                    `Player: ${
                        player.options.guild
                    } | A wild player has been created in ${
                        client.guilds.cache.get(player.options.guild)
                            ? client.guilds.cache.get(player.options.guild).name
                            : "a guild"
                    }`
                );
            })
            .on("playerDestroy", (player) => {
                this.warn(
                    `Player: ${
                        player.options.guild
                    } | A wild player has been destroyed in ${
                        client.guilds.cache.get(player.options.guild)
                            ? client.guilds.cache.get(player.options.guild).name
                            : "a guild"
                    }`
                );
                player.setNowplayingMessage(client, null);
            })
            // on LOAD_FAILED send error message
            .on("loadFailed", (node, type, error) =>
                this.warn(
                    `Node: ${node.options.identifier} | Failed to load ${type}: ${error.message}`
                )
            )
            // on TRACK_START send message
            .on(
                "trackStart",
                /** @param {EpicPlayer} player */ async (player, track) => {
                    this.songsPlayed++;
                    playedTracks.push(track.identifier);
                    if (playedTracks.length >= 100) {
                        playedTracks.shift();
                    }

                    this.warn(
                        `Player: ${
                            player.options.guild
                        } | Track has been started playing [${colors.blue(
                            track.title
                        )}]`
                    );
                    var title = escapeMarkdown(track.title);
                    var title = title.replace(/\]/g, "");
                    var title = title.replace(/\[/g, "");
                    let trackStartedEmbed = this.Embed()
                        .setAuthor({
                            name: "Now playing",
                            iconURL: this.config.iconURL,
                        })
                        .setDescription(
                            `[${title}](${track.uri})` || "No Descriptions"
                        )
                        .addFields(
                            {
                                name: "Requested by",
                                value: `${
                                    track.requester || `<@${client.user.id}>`
                                }`,
                                inline: true,
                            },
                            {
                                name: "Duration",
                                value: track.isStream
                                    ? `\`LIVE\``
                                    : `\`${prettyMilliseconds(track.duration, {
                                          colonNotation: true,
                                      })}\``,
                                inline: true,
                            }
                        );
                    try {
                        trackStartedEmbed.setThumbnail(
                            track.displayThumbnail("maxresdefault")
                        );
                    } catch (err) {
                        trackStartedEmbed.setThumbnail(track.thumbnail);
                    }
                    let nowPlaying = await client.channels.cache
                        .get(player.textChannel)
                        .send({
                            embeds: [trackStartedEmbed],
                            components: [
                                client.createController(
                                    player.options.guild,
                                    player
                                ),
                            ],
                        })
                        .catch(this.warn);
                    player.setNowplayingMessage(client, nowPlaying);
                }
            )

            .on(
                "playerDisconnect",
                /** @param {EpicPlayer} */ async (player) => {
                    if (player.twentyFourSeven) {
                        player.queue.clear();
                        player.stop();
                        player.set("autoQueue", false);
                    } else {
                        player.destroy();
                    }
                }
            )

            .on(
                "queueEnd",
                /** @param {EpicPlayer} */ async (player, track) => {
                    const autoQueue = player.get("autoQueue");

                    if (autoQueue) {
                        const requester = player.get("requester");
                        const identifier = track.identifier;
                        const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                        const res = await player.search(search, requester);
                        let nextTrackIndex;

                        res.tracks.some((track, index) => {
                            nextTrackIndex = index;
                            return !playedTracks.includes(track.identifier);
                        });

                        if (res.exception) {
                            client.channels.cache.get(player.textChannel).send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor("RED")
                                        .setAuthor({
                                            name: `${res.exception.severity}`,
                                            iconURL: client.config.iconURL,
                                        })
                                        .setDescription(
                                            `Could not load track.\n**ERR:** ${res.exception.message}`
                                        ),
                                ],
                            });
                            return player.destroy();
                        }

                        player.play(res.tracks[nextTrackIndex]);
                        player.queue.previous = track;
                    } else {
                        const twentyFourSeven = player.get("twentyFourSeven");

                        let queueEmbed = new MessageEmbed()
                            .setColor(client.config.embedColor)
                            .setAuthor({
                                name: "The queue has ended",
                                iconURL: client.config.iconURL,
                            })
                            .setFooter({ text: "Queue ended" })
                            .setTimestamp();
                        let EndQueue = await client.channels.cache
                            .get(player.textChannel)
                            .send({ embeds: [queueEmbed] });
                        setTimeout(() => EndQueue.delete(true), 5000);
                        try {
                            if (!player.playing && !twentyFourSeven) {
                                setTimeout(async () => {
                                    if (
                                        !player.playing &&
                                        player.state !== "DISCONNECTED"
                                    ) {
                                        let disconnectedEmbed =
                                            new MessageEmbed()
                                                .setColor(
                                                    client.config.embedColor
                                                )
                                                .setAuthor({
                                                    name: "Disconnected!",
                                                    iconURL:
                                                        client.config.iconURL,
                                                })
                                                .setDescription(
                                                    `The player has been disconnected due to inactivity.`
                                                );
                                        let Disconnected =
                                            await client.channels.cache
                                                .get(player.textChannel)
                                                .send({
                                                    embeds: [disconnectedEmbed],
                                                });
                                        setTimeout(
                                            () => Disconnected.delete(true),
                                            6000
                                        );
                                        player.destroy();
                                    } else if (player.playing) {
                                        client.warn(
                                            `Player: ${player.options.guild} | Still playing`
                                        );
                                    }
                                }, client.config.disconnectTime);
                            } else if (!player.playing && twentyFourSeven) {
                                client.warn(
                                    `Player: ${
                                        player.options.guild
                                    } | Queue has ended [${colors.blue(
                                        "24/7 ENABLED"
                                    )}]`
                                );
                            } else {
                                client.warn(
                                    `Something unexpected happened with player ${player.options.guild}`
                                );
                            }
                            player.setNowplayingMessage(client, null);
                        } catch (err) {
                            client.error(err);
                        }
                    }
                }
            );
    }

    /**
     * Checks if a message has been deleted during the run time of the Bot
     * @param {Message} message
     * @returns
     */
    isMessageDeleted(message) {
        return this.deletedMessages.has(message);
    }

    /**
     * Marks (adds) a message on the client's `deletedMessages` WeakSet so it's
     * state can be seen through the code
     * @param {Message} message
     */
    markMessageAsDeleted(message) {
        this.deletedMessages.add(message);
    }

    /**
     *
     * @param {string} text
     * @returns {MessageEmbed}
     */
    Embed(text) {
        let embed = new MessageEmbed().setColor(this.config.embedColor);

        if (text) {
            embed.setDescription(text);
        }

        return embed;
    }

    /**
     *
     * @param {string} text
     * @returns {MessageEmbed}
     */
    ErrorEmbed(text) {
        let embed = new MessageEmbed()
            .setColor("RED")
            .setDescription("❌ | " + text);

        return embed;
    }
}

module.exports = { DiscordBot };
