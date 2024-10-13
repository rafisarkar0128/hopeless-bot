const mongoose = require("mongoose");
const colors = require("colors");

module.exports = {
  /** a function to connect to mongobd throuigh mongoose
   * @param {import("@lib/DiscordBot.js").DiscordBot} client
   * @returns {Promise<void>}
   */
  connect: async (client) => {
    try {
      await mongoose.connect(client.config.mongo_uri);
      client.logger.info(`${colors.magenta("mongodb")} database connected`);
    } catch (error) {
      client.logger.error(error);
    }
  },

  // easy way to load schemas
  schemas: {
    guild: require("@root/src/database/schemas/guild.js"),
  },
};
