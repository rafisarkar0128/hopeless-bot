const colors = require("colors");

/**
 * @type {import("../../index.d.ts").EventStructure}
 */
module.exports = {
    name: "ready",
    once: true,
    rest: false,
    execute: async (client) => {
        try {
            client.logger.info(`${colors.green(client.user.tag)} is online`);
        } catch (error) {
            client.utils.sendError(client, error);
            throw error;
        }
    },
};
