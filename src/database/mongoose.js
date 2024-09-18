const mongoose = require("mongoose");
const colors = require("colors");

module.exports = {
    /**
     * @param {import("../lib/DiscordBot.js").DiscordBot} client
     */
    connect: async (client) => {
        try {
            await mongoose.connect(client.config.mongodbUri);
            client.logger.info(`${colors.magenta("mongodatabase")} connected`);
        } catch (error) {
            client.logger.error(error);
        }
    },

    schemas: {
        Giveaways: require("./schemas/Giveaways.js"),
        Guild: require("./schemas/Guild.js"),
        Member: require("./schemas/Member.js"),
        ReactionRoles: require("./schemas/ReactionRoles.js").model,
        ModLog: require("./schemas/ModLog.js").model,
        TranslateLog: require("./schemas/TranslateLog.js").model,
        User: require("./schemas/User.js"),
        Suggestions: require("./schemas/Suggestions.js").model,
        ErrorLogConfig: require("./schemas/ErrorLogConfig.js").model,
    },
};
