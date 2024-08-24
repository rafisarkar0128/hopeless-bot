module.exports = {
    config: {
        bot: {
            token: process.env["DISCORD_TOKEN"],
            id: process.env["DISCORD_CLIENT_ID"],
            secret: process.env["DISCORD_CLIENT_SECRET"],
        },
        mal: {
            id: process.env["MAL_CLIENT_ID"],
            secret: process.env["MAL_CLIENT_SECRET"],
        },
        mongoUri: process.env["MONGO_URI"],
        serverId: process.env["SERVER_ID"],
        ownerId: process.env["OWNER_ID"],
        devs: process.env["DEVELOPER_ID"],
    },
    colors: {
        embed: "#1a1818",
        good: "#74a371",
        standBy: "#dedc5d",
        wrong: "#de5d5d",
        main: "#d0cab1",
        americanRose: "#FF033E",
        androidGreen: "#32de84",
        green: "#00ffaa",
        powderBlue: "#b0e0e6",
        azure: "#007FFF",
    },
    emojis: {
        play: "▶️",
        stop: "⏹️",
        queue: "📄",
        repeat: "🔁",
        error: "❌",
        success: "✅",
    },
};
