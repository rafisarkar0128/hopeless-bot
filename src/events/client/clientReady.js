const colors = require("colors");

/**
 * @type {import("@src/index").EventStructure}
 */
module.exports = {
    name: "ready",
    once: true,
    rest: false,
    execute: async (client) => {
        await client.logger.info(`${colors.green(client.user.tag)} is online`);
    },
};
