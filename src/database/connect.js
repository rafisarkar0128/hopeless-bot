const mongoose = require("mongoose");
const colors = require("colors");

module.exports = {
  async initializeMongoose(client) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      client.logger.log(colors.cyan(" | mongodb connection established."));
    } catch (error) {
      throw error;
    }
  },

  schemas: {
    Giveaways: require("./schemas/Giveaways"),
    Guild: require("./schemas/Guild"),
    Member: require("./schemas/Member"),
    ReactionRoles: require("./schemas/ReactionRoles").model,
    ModLog: require("./schemas/ModLog").model,
    TranslateLog: require("./schemas/TranslateLog").model,
    User: require("./schemas/User"),
    Suggestions: require("./schemas/Suggestions").model,
  },
};
