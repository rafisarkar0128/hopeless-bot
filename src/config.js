module.exports = {
    config: {
        token: process.env["DISCORD_TOKEN"],
        mongouri: process.env["MONGO_URI"],
        serverId: process.env["SERVER_ID"],
        botId: process.env["CLIENT_ID"],
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
