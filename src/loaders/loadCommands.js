const { Collection, REST, Routes } = require("discord.js");
const colors = require("colors");
const loadFiles = require("./loadFiles.js");

/**
 *@param {import("../structures/DiscordBot.js").DiscordBot} client - base client
 *@param {String} dir - path of events directory
 */
module.exports = async (client, dir) => {
  const rest = new REST({ version: 10 }).setToken(client.config.bot.token);
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
      i++;
    } catch (error) {
      client.logger.error(error);
    }
  }

  rest.put(
    Routes.applicationGuildCommands(
      client.config.bot.id,
      client.config.serverId
    ),
    {
      body: applicationCommands,
    }
  );

  client.logger.log(colors.blue(`loaded ${i} commands.`));
};
