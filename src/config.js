// exporting some configs
module.exports = {
    // important stuff
    config: {
        token: process.env["DISCORD_TOKEN"] || undefined,
        mongouri: process.env["MONGO_URI"] || undefined,
        serverId: process.env["SERVER_ID"] || undefined,
        botId: process.env["CLIENT_ID"] || undefined,
        ownerId: process.env["OWNER_ID"] || undefined,
    },
    // colors for embeds
    colors: {
        main: "#d0cab1",
        error: "FF0000",
        standby: "000000",
        americanRose: "#FF033E",
        androidGreen: "#32de84",
        powderBlue: "#b0e0e6",
        azure: "#007FFF",
    },
    // emojis for music commands
    emojis: {
        play: "▶️",
        stop: "⏹️",
        queue: "📄",
        success: "☑️",
        repeat: "🔁",
        error: "❌",
        success: "✅",
    },
};
