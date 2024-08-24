const { Client, version } = require("discord.js");
var AsciiTable = require("ascii-table");
var table = new AsciiTable();
table.setBorder("│", "─", " ", " ");
table.setTitle(`Bot is online!`);

module.exports = {
    name: "ready",
    once: true,
    rest: false,
    /**
     *
     * @param {Client} client
     */
    execute: async (client) => {
        client.log(`✅ logged in as ${client.user.tag}.`, "ready");
        table
            .addRow(`Bot Tag`, client.user.tag)
            .addRow(`Guild(s)`, `${client.guilds.cache.size} Server(s)`)
            .addRow(
                `Member(s)`,
                `${client.guilds.cache
                    .reduce((a, b) => a + b.memberCount, 0)
                    .toLocaleString()} Members`
            )
            .addRow(`Commands`, `${client.commands.size}`)
            .addRow(`Discord.JS version`, `${version}`)
            .addRow(`Node.JS Version`, `${process.version}`)
            .addRow(
                `Memory`,
                `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                    2
                )} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
                    2
                )} MB`
            );

        setTimeout(() => {
            console.log(table.toString());
        }, 5e3);
    },
};
