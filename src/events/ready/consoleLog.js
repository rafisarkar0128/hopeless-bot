const { Client } = require("discord.js");
const colors = require("colors");

module.exports = {
  name: "ready",
  once: true,
  rest: false,
  /**
   *
   * @param {Client} client
   */
  execute: async (client) => {
    client.logger.log(colors.green(` | logged in as ${client.user.tag}.`));
  },
};
