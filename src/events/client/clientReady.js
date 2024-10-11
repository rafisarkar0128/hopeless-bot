const colors = require("colors");

/** @type {import("@types/events").EventStructure} */
module.exports = {
  name: "ready",
  once: true,
  rest: false,
  ws: false,
  moonlink: false,
  execute: async (client) => {
    client.logger.info(`${colors.green(client.user.tag)} is online`);

    // Initializing the Moonlink.js package with the client's user ID
    client.moonlink.init(client.user.id);

    // Synchronizing Slash & ContextMenu Commands with discord
    await client.syncCommands(client);
  },
};
