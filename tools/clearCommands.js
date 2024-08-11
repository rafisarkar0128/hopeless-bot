require("dotenv").config();
const { REST, Routes } = require("discord.js");
const rest = new REST().setToken(process.env["DISCORD_TOKEN"]);

let applicationCommands = [];
let applicationGuildCommands = [];

async function clearCommands() {
    await rest.put(
        Routes.applicationGuildCommands(
            process.env["CLIENT_ID"],
            process.env["SERVER_ID"]
        ),
        {
            body: applicationGuildCommands,
        }
    );

    await rest.put(Routes.applicationCommands(process.env["CLIENT_ID"]), {
        body: applicationCommands,
    });

    console.log("✅ Successfully cleared bots commands.");
}

module.exports = { clearCommands };

clearCommands().catch((error) => console.error(error));
