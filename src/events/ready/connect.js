const { Client } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    name: "ready",
    once: true,
    rest: false,
    /**
     *
     * @param {Client} client
     */
    execute: async (client) => {
        try {
            await mongoose.connect(client.config.mongoUri);
            client.log("database connected.", "ready");
        } catch (error) {
            throw error;
        }
    },
};
