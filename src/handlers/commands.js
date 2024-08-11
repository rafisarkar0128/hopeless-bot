async function loadCommands(client, dir) {
    const { REST, Routes } = require("discord.js");
    const rest = new REST().setToken(client.config.token);
    const ascii = require("ascii-table");
    const table = new ascii("COMMANDS")
        .setBorder("│", "─", " ", " ")
        .setHeading("FILES", "STATUS");
    const files = await client.loadFiles(dir);

    let applicationCommands = [];
    let applicationGuildCommands = [];

    await client.commands.clear();
    await client.subCommands.clear();

    for (const file of files) {
        try {
            const commandObject = require(file);

            if (commandObject.subCommand) {
                client.subCommands.set(commandObject.name, commandObject);
            } else {
                client.commands.set(commandObject.data.name, commandObject);

                if (commandObject.testOnly)
                    applicationGuildCommands.push(commandObject.data);
                else applicationCommands.push(commandObject.data);
            }

            table.addRow(file.split("\\").pop(), "✅");
        } catch (error) {
            table
                .setHeading("FILES", "STATUS", "PATH", "ERROR")
                .addRow(
                    file.split("\\").pop(),
                    "❌",
                    file.split("\\").slice(7).join("\\"),
                    `${error}`
                );

            throw error;
        }
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
    return client.log("✅ loaded commands", "log");
}

module.exports = { loadCommands };
