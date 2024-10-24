const colors = require("colors");

/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
    client.logger.info(`${colors.green(client.user.tag)} is online`);

    // initializing music player
    client.lavalink.init(client.user);

    // Synchronizing Slash & ContextMenu Commands with discord
    await client.syncCommands(client);
  },
};
