// command hanlder function
async function loadCommands(client, dir) {
    // variables
    const ascii = require("ascii-table");
    const { REST, Routes } = require("discord.js");
    const rest = new REST().setToken(client.config.token);
    const applicationGuildCommands = [];
    const table = new ascii("COMMANDS")
        .setBorder("│", "─", " ", " ")
        .setHeading("FILES", "STATUS");
    const files = await client.loadFiles(dir);

    await client.commands.clear();

    for (const file of files) {
        try {
            const commandObject = require(file);

            await client.commands.set(commandObject.data.name, commandObject);
            applicationGuildCommands.push(commandObject.data);

            table.addRow(file.split("\\").pop(), "✅");
        } catch (error) {
            table.addRow(file.split("\\").pop(), `❌ | ${file}`);
        }
    }

    rest.put(
        Routes.applicationGuildCommands(
            client.config.botId,
            client.config.serverId
        ),
        {
            body: applicationGuildCommands,
        }
    );

    console.log(table.toString());
    return client.log("loaded commands", "log");
}

// exporting the function
module.exports = { loadCommands };
