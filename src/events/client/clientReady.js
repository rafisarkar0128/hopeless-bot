const colors = require("colors");
const syncCommands = require("../../helpers/synchronizeCommands.js");
const { initializeMongoose } = require("../../database/connect.js");

module.exports = {
    name: "ready",
    once: true,
    rest: false,
    /**
     * @param {import("../../structures/DiscordBot.js").DiscordBot} client
     */
    execute: async (client) => {
        client.info(colors.green(`logged in as ${client.user.tag}`));
        await initializeMongoose(client);
        syncCommands(client);
    },
};
