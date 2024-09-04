require("dotenv").config();
const colors = require("colors");
const token = process.env["BOT_TOKEN"];
const clientId = process.env["BOT_ID"];
const serverId = process.env["SERVER_ID"];
const wait = require("timers/promises").setTimeout;
const readline = require("readline");
const axios = require("axios");
const apiUrl = "https://discord.com/api/v10";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const warningMsg =
    colors.yellow(`------------------------- !!! WARNING !!! -------------------------
This script will delete every Slash Command of your discord bot.
Do you want to continue? (y/n): `);
console.clear();
rl.question(warningMsg, async function (name) {
    try {
        if (name.toLowerCase() === "y") {
            console.log(colors.cyan("🧨 Started deleting Slash Commands."));
            await deleteCommands();
            console.log(
                colors.cyan("\n⚡ Succesfully deleted all Slash Commands.")
            );
            process.exit(0);
        } else {
            console.log(colors.red("Canceled the deletion."));
            process.exit(0);
        }
    } catch (error) {
        console.log(colors.red(error?.stack ? error?.stack : error));
        process.exit(1);
    }
});

function clearAndWrite(message) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(message);
}

function clearAndLog(message) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(message);
}

async function deleteCommands() {
    await wait(2000);
    process.stdout.write(colors.yellow("\n🌏 Deleting global slash commands."));
    await wait(2000);
    const globalCommands = await axios.get(
        `${apiUrl}/applications/${clientId}/commands`,
        {
            headers: {
                Authorization: `Bot ${token}`,
            },
        }
    );

    if (globalCommands.data.length === 0) {
        clearAndLog(
            colors.yellow("🔥 Couldn't fing any global slash command.")
        );
    } else {
        for (const command of globalCommands.data) {
            clearAndWrite(colors.blue(`🧹 Deleting ${command.name}`));
            await wait(2000);
            const response = await axios.delete(
                `${apiUrl}/applications/${clientId}/commands/${command.id}`,
                {
                    headers: {
                        Authorization: `Bot ${token}`,
                    },
                }
            );
            if (response.status === 204) {
                clearAndWrite(colors.green(`✅ deleted ${command.name}`));
            } else {
                clearAndWrite(colors.red(`❌ couldn't delete ${command.name}`));
            }
            await wait(2000);
        }

        clearAndLog(
            colors.blue(
                `🧹 Deleted ${globalCommands.data.length} global Slash Commands`
            )
        );
    }

    await wait(2000);
    process.stdout.write(colors.yellow("🔰 Deleting guild slash commands."));
    await wait(2000);
    const guildCommands = await axios.get(
        `${apiUrl}/applications/${clientId}/guilds/${serverId}/commands`,
        {
            headers: {
                Authorization: `Bot ${token}`,
            },
        }
    );

    if (guildCommands.data.length === 0) {
        clearAndLog(colors.yellow("🔥 Couldn't fing any guild slash command."));
    } else {
        for (const command of guildCommands.data) {
            clearAndWrite(colors.blue(`🧹 Deleting ${command.name}`));
            await wait(2000);
            const response = await axios.delete(
                `${apiUrl}/applications/${clientId}/guilds/${serverId}/commands/${command.id}`,
                {
                    headers: {
                        Authorization: `Bot ${token}`,
                    },
                }
            );

            if (response.status === 204) {
                clearAndWrite(colors.green(`✅ deleted ${command.name}`));
            } else {
                clearAndWrite(colors.red(`❌ couldn't delete ${command.name}`));
            }
            await wait(2000);
        }

        clearAndLog(
            colors.blue(
                `🧹 Deleted ${guildCommands.data.length} guild Slash Commands`
            )
        );
    }
}
