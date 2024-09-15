const { version } = require("discord.js");
const colors = require("colors");
const AsciiTable = require("ascii-table");

module.exports = {
  name: "ready",
  once: true,
  rest: false,
  /**
   * @param {import("../../structures/DiscordBot.js").DiscordBot} client
   */
  execute: async (client) => {
    const table = new AsciiTable();
    table.removeBorder().setTitle(`Bot is online!`);

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
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(
          process.memoryUsage().rss /
          1024 /
          1024
        ).toFixed(2)} MB`
      );

    await client.logBox(table.toString(), {
      borderColor: client.colors.DeepSkyBlue,
      textAlignment: "center",
      padding: {
        left: 7,
        right: 7,
        top: 1,
        bottom: 1,
      },
    });
    return client.info(colors.green(`logged in as ${client.user.tag}.`));
  },
};
