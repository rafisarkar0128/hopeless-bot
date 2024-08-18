async function loadCommands(client, dir) {
    try {
        const { REST, Routes } = require("discord.js");
        const rest = new REST({ version: 10 }).setToken(client.config.token);
        const ascii = require("ascii-table");
        const table = new ascii("COMMANDS")
            .setBorder("│", "─", " ", " ")
            .setHeading("files", "status");

        const { loadFiles } = require("../functions/loadFiles.js");
        const files = await loadFiles(dir);

        let applicationCommands = [];
        let applicationGuildCommands = [];

        await client.commands.clear();
        await client.subCommands.clear();

        for (const file of files) {
            const commandObject = require(file);

            if (commandObject.toggleOff) return;

            if (commandObject.subCommand) {
                client.subCommands.set(commandObject.name, commandObject);
            } else {
                client.commands.set(commandObject.data.name, commandObject);
                if (commandObject.testOnly) {
                    applicationGuildCommands.push(commandObject.data);
                } else {
                    applicationCommands.push(commandObject.data);
                }
            }

            table.addRow(file.split("\\").pop(), "✅");
        }
        if (applicationGuildCommands.length) {
            rest.put(
                Routes.applicationGuildCommands(
                    client.config.botId,
                    client.config.serverId
                ),
                {
                    body: applicationGuildCommands,
                }
            );
        }

        rest.put(Routes.applicationCommands(client.config.botId), {
            body: applicationCommands,
        });

        console.log(table.toString());
        return client.log("✅ loaded commands.", "command");
    } catch (error) {
        throw error;
    }
}

module.exports = { loadCommands };
