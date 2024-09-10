const { Collection, Routes } = require("discord.js");
const colors = require("colors");
const AsciiTable = require("ascii-table");
const loadFiles = require("./loadFiles.js");
const table = new AsciiTable();
table.removeBorder().setAlign(1, AsciiTable.RIGHT).setJustify(true);

/**
 *@param {import("../structures/DiscordBot.js").DiscordBot} client - base client
 *@param {String} dir - path of events directory
 */
module.exports = async (client, dir) => {
  client.logger.log(colors.yellow(" | started to load commands."));

  const files = await loadFiles(dir);
  const applicationCommands = [];

  client.commands.clear();
  client.slashCommands.clear();

  let i = 0,
    p = 0;
  for (const file of files) {
    try {
      const object = require(file);

      if (object.enabled) continue;
      if (object.cooldown) {
        client.cooldowns.set(object.data?.name, new Collection());
      }

      applicationCommands.push(object.data);
      client.slashCommands.set(object.data.name, object);

      table.addRow(file.replace(/\\/g, "/").split("/").pop(), "✅");
      i++;
    } catch (error) {
      table.addRow(file.replace(/\\/g, "/").split("/").pop(), "❌");
      client.error(error);
    }
  }

  await client.logBox(table.toString(), {
    borderColor: "#00BFFF",
    stringAlignment: "center",
    padding: {
      left: 5,
      right: 5,
      top: 1,
      bottom: 1,
    },
  });

  client.rest.put(
    Routes.applicationGuildCommands(
      client.config.bot.id,
      client.config.serverId
    ),
    {
      body: applicationCommands,
    }
  );

  client.logger.log(colors.blue(` | loaded ${i} commands.`));
};
