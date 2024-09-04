const { Client, version } = require("discord.js");
const colors = require("colors");
const AsciiTable = require("ascii-table");
const table = new AsciiTable();
table.setBorder(" ", " ", " ", " ");
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
        client.log(colors.green(` | logged in as ${client.user.username}.`));
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
            client.logBox(table.toString(), {
                borderColor: "#00BFFF",
                stringAlignment: "center",
                padding: {
                    left: 8,
                    right: 8,
                },
            });
        }, 3e3);
    },
};
