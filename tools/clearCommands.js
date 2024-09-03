async function clearCommands(token, clientId, serverId) {
    const { REST, Routes } = require("discord.js");
    const rest = new REST().setToken(token);

    let applicationCommands = [];
    let applicationGuildCommands = [];

    await rest.put(Routes.applicationGuildCommands(clientId, serverId), {
        body: applicationGuildCommands,
    });

    await rest.put(Routes.applicationCommands(clientId), {
        body: applicationCommands,
    });

    console.log("✅ Successfully cleared bots commands.");
}

module.exports = { clearCommands };

require("dotenv").config();
clearCommands(
    process.env["DISCORD_TOKEN"],
    process.env["DISCORD_CLIENT_ID"],
    process.env["SERVER_ID"]
).catch((error) => console.error(error));
