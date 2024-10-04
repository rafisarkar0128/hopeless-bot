const colors = require("colors");

/**
 * @type {import("@src/index").EventStructure}
 */
module.exports = {
    name: "ready",
    once: true,
    rest: false,
    execute: async (client) => {
        client.logger.info(`${colors.green(client.user.tag)} is online`);
        await client.lavalink.init(client.user);
        client.logger.info(`music system is online`);
    },
};
