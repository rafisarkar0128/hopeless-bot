const colors = require("colors");

/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
    // Log that the bot is online
    client.logger.info(__filename, `${colors.green(client.user.tag)} is online`);

    // Initialize the music player
    client.lavalink.init(client.user);

    // Synchronize Slash & ContextMenu Commands with Discord
    await client.syncCommands(client);
  },
};
