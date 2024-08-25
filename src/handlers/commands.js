async function loadCommands(client) {
    try {
        const { REST, Routes, Collection } = require("discord.js");
        const rest = new REST({ version: 10 }).setToken(
            client.config.bot.token
        );

        const { loadJSFiles } = require("../utils/file.utils.js");
        const commandFiles = await loadJSFiles("commands");
        const subCommandFiles = await loadJSFiles("subcommands");

        let applicationCommands = [];
        let applicationGuildCommands = [];

        await client.commands.clear();
        await client.subCommands.clear();

        let i = 0;
        let g = 0;

        for (const file of commandFiles) {
            const commandObject = require(file);

            if (commandObject.toggleOff) continue;
            if (commandObject.cooldown) {
                client.cooldowns.set(
                    commandObject.data?.name,
                    new Collection()
                );
            }
            if (commandObject.testOnly) {
                applicationGuildCommands.push(commandObject.data);
            } else {
                applicationCommands.push(commandObject.data);
            }

            client.commands.set(commandObject.data.name, commandObject);
            i++;
        }

        for (const file of subCommandFiles) {
            const subCommandObject = require(file);
            if (subCommandObject.toggleOff) continue;
            client.subCommands.set(subCommandObject.name, subCommandFiles);
            g++;
        }

        if (applicationGuildCommands.length) {
            rest.put(
                Routes.applicationGuildCommands(
                    client.config.bot.id,
                    client.config.serverId
                ),
                {
                    body: applicationGuildCommands,
                }
            );
        }

        rest.put(Routes.applicationCommands(client.config.bot.id), {
            body: applicationCommands,
        });

        client.log(`loaded ${i} commands and ${g} sub commands.`, "command");
    } catch (error) {
        throw error;
    }
}

module.exports = { loadCommands };
