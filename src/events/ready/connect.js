// variables
const { Client } = require("discord.js");
const mongoose = require("mongoose");

// exporting the modules
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
            await mongoose.connect(client.config.mongouri);
            client.log("✅ database connected.", "log");
        } catch (error) {
            throw error;
        }
    },
};
