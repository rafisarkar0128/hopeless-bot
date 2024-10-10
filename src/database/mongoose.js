const mongoose = require("mongoose");
const colors = require("colors");

module.exports = {
  /**
   * @param {import("../lib/DiscordBot.js").DiscordBot} client
   */
  connect: async (client) => {
    try {
      await mongoose.connect(client.config.mongodbUri);
      client.logger.info(`${colors.magenta("mongodb")} database connected`);
    } catch (error) {
      client.logger.error(error);
    }
  },

  schemas: {
    Giveaways: require("./schemas/giveaways.js"),
    Guild: require("./schemas/guild.js"),
    Member: require("./schemas/member.js"),
    ReactionRoles: require("./schemas/reactionRoles.js").model,
    ModLog: require("./schemas/modLog.js").model,
    TranslateLog: require("./schemas/translateLog.js").model,
    User: require("./schemas/user.js"),
    Suggestions: require("./schemas/suggestions.js").model,
    ErrorLogConfig: require("./schemas/errorlogs.js").model,
  },
};
