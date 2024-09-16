const mongoose = require("mongoose");
const colors = require("colors");

module.exports = {
    /**
     * @param {import("../structures/DiscordBot.js").DiscordBot} client
     */
    async initializeMongoose(client) {
        try {
            await mongoose.connect(client.config.mongodbUri);
            client.info(colors.cyan("mongodb connection established"));
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
