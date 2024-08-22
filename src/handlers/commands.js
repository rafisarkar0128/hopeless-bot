async function loadCommands(client, dir) {
    try {
        const { REST, Routes, Collection } = require("discord.js");
        const rest = new REST({ version: 10 }).setToken(
            client.config.bot.token
        );
        const ascii = require("ascii-table");
        const table = new ascii("COMMANDS")
            .setBorder("│", "─", " ", " ")
            .setHeading("files", "status");

        const { loadJSFiles } = require("../utils/file.util.js");
        const files = await loadJSFiles(dir);

        let applicationCommands = [];
        let applicationGuildCommands = [];

        await client.commands.clear();
        await client.subCommands.clear();

        for (const file of files) {
            const commandObject = require(file);

            if (commandObject.toggleOff) return;

            if (commandObject.cooldown) {
                client.cooldowns.set(
                    commandObject.data?.name || commandObject?.name,
                    new Collection()
                );
            }

            if (commandObject.subCommand) {
                client.subCommands.set(commandObject.name, commandObject);
            } else {
                client.commands.set(commandObject.data.name, commandObject);
            }

            if (commandObject.data) {
                if (commandObject.testOnly) {
                    applicationGuildCommands.push(commandObject.data);
                } else {
                    applicationCommands.push(commandObject.data);
                }
            }
            table.addRow(file.replace(/\\/g, "/").split("/").pop(), "✅");
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

        console.log(table.toString());
        return client.log("✅ loaded commands.", "command");
    } catch (error) {
        throw error;
    }
}

module.exports = { loadCommands };
