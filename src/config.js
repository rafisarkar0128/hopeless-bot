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
        main: "#d0cab1",
        error: "FF0000",
        standby: "000000",
        americanRose: "#FF033E",
        androidGreen: "#32de84",
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
