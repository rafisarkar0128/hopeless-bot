const colors = require("colors");

/** @type {import("@types/events").DiscordEventStructure} */
module.exports = {
    name: "ready",
    once: true,
    rest: false,
    execute: async (client) => {
        client.logger.info(`${colors.green(client.user.tag)} is online`);

        // Initializing the Moonlink.js package with the client's user ID
        client.moonlink.init(client.user.id);
        client.logger.info(`music system is online`);
    },
};
