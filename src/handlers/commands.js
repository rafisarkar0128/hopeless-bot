const colors = require("colors");
const { REST, Routes, Collection } = require("discord.js");
const { loadJSFiles } = require("../utils/file.utils.js");

async function loadCommands(client) {
    try {
        const rest = new REST({ version: 10 }).setToken(
            client.config.bot.token
        );
        const files = await loadJSFiles("commands");
        const applicationCommands = [];

        let i = 0;
        for (const file of files) {
            const object = require(file);

            if (object.toggleOff) continue;
            if (object.cooldown) {
                client.cooldowns.set(object.data?.name, new Collection());
            }
            if (object.testOnly) {
                applicationGuildCommands.push(object.data);
            } else {
                applicationCommands.push(object.data);
            }

            client.slashCommands.set(object.data.name, object);
            i++;
        }

        /*if (applicationGuildCommands.length) {
      rest.put(
        Routes.applicationGuildCommands(
          client.config.bot.id,
          client.config.serverId
        ),
        {
          body: applicationGuildCommands,
        }
      );
    }*/

        rest.put(Routes.applicationCommands(client.config.bot.id), {
            body: applicationCommands,
        });

        client.debug(colors.blue(` | loaded ${i} commands.`));
    } catch (error) {
        throw error;
    }
}

module.exports = { loadCommands };
