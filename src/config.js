module.exports = {
    bot: {
        defaultPrefix: process.env.DEAFULT_PREFIX, // bot's prefix
        id: process.env.BOT_ID, // bot's id
        token: process.env.BOT_TOKEN, // bot's token
        secret: process.env.BOT_SECRET, // bot's secret
        invite: process.env.ALLOWED_INVITE, // invite permission
        footer: `Copyright © 2023 - ${new Date().getFullYear()} @theassassin0128`, // Footer text for embeds
    },
    ownerId: process.env.OWNER_ID, // bot's owner id
    serverId: process.env.SERVER_ID, // bot's test server id
    devs: process.env.DEVELOPER_IDS, // bot developers id
    mongodbUri: process.env.MONGO_URI, // mongodb database connection string
    antiCrash: {
        enabled: true,
    },
    commands: {
        messageCommands: true,
        slashCommands: true,
        contextMenuCommands: false,
        modalSubmit: false,
        globalCommands: false,
    },
    emojis: {
        resume: "▶️",
        pause: "⏸️",
        next: "⏭️",
        previous: "⏮️",
        stop: "⏹️",
        loop: "🔁",
        loop2: "🔂",
        shuffle: "🔀",
        speedup: "⏩",
        slowdown: "⏪",
        play: "▶️",
        queue: "📄",
        repeat: "🔁",
        error: "❌",
        success: "✅",
    },
    links: {
        suportServer: "https://discord.gg/E6H9VvBdTk",
    },
    imageLinks: {
        glitch: "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png",
    },
    cacheSize: {
        guilds: 100,
        users: 10000,
        members: 10000,
    },

    // PLUGINS
    auto_moderation: {
        enabled: true,
    },
    dashboard: {
        enabled: true,
        base_url: "https://discord-js-bot.crazyyopppp.repl.co",
        failure_url: "https://discord-js-bot.crazyyopppp.repl.co",
        port: "3000",
    },
    economy: {
        enabled: true,
        currency: "💵",
        daily_coins: 100,
        min_beg_amount: 100,
        max_beg_amount: 2500,
    },
    music: {
        enabled: true,
        idle_time: 180000,
        max_search_results: 5,
        default_source: "YTM", // YT = Youtube, YTM = Youtube Music, SC = SoundCloud

        // Add any number of lavalink nodes here
        // Refer to https://github.com/freyacodes/Lavalink to host your own lavalink server
        lavalink_nodes: [
            {
                host: "lavalink.oddcoder.xyz",
                port: 443,
                password: "oddcoder",
                id: "Local Node",
                secure: true,
            },
        ],
    },
    giveaways: {
        enabled: false,
        reaction: "🎁",
    },
    image: {
        enabled: true,
        base_api: "https://strangeapi.fun/api",
    },
    moderation: {
        enabled: true,
        EMBED_COLORS: {
            TIMEOUT: "#102027",
            UNTIMEOUT: "#4B636E",
            KICK: "#FF7961",
            SOFTBAN: "#AF4448",
            BAN: "#D32F2F",
            UNBAN: "#00C853",
            VMUTE: "#102027",
            VUNMUTE: "#4B636E",
            DEAFEN: "#102027",
            UNDEAFEN: "#4B636E",
            DISCONNECT: "RANDOM",
            //MOVE: colors.Magenta,
        },
    },

    stats: {
        enabled: true,
        xp_cooldown: 10,
        default_levelup_message: "{member:tag}, You just advanced to **Level {level}**",
    },

    suggestion: {
        enabled: true, // Should the suggestion system be enabled
        emoji: {
            up_vote: "⬆️",
            down_vote: "⬇️",
        },
    },

    ticket: {
        enabled: true,
    },
};
