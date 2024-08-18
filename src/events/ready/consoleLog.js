const { Client } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    rest: false,
    /**
     *
     * @param {Client} client
     */
    execute: async (client) => {
        client.log(`✅ ${client.user.tag} is online.`, "ready");
    },
};
