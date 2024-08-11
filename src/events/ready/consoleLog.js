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
        const ascii = require("ascii-table");
        const table = new ascii("BOT INFO");
        table.setBorder("│", "─", " ", " ");
        table.setHeading("ITEMS", "VALUES");

        table.addRow("Username", client.user.username);
        table.addRow("Tag", client.user.tag);
        table.addRow("Id", client.user.id);
        table.addRow("Servers", client.guilds.cache.size);
        table.addRow("Members", await client.getMemberCount(client));

        console.log(table.toString());
        client.log("✅ bot is online", "log");
    },
};
