const { Collection, Routes } = require("discord.js");
const colors = require("colors");
const AsciiTable = require("ascii-table");
const fetchSlashCommands = require("./fetchSlashCommands.js");
const getCommands = require("./getLocalCommands.js");

/**
 * @param {import("../structures/DiscordBot.js").DiscordBot} client
 */
module.exports = async (client) => {
    client.info(colors.yellow("Checking for changes in Slash Commands"));
    const { Commands, SlashCommandsData } = await getCommands(client, {
        dirname: "commands",
    });
    const currentSlashCommands = await fetchSlashCommands(client);

    //console.log(currentSlashCommands.length, currentSlashCommands);

    let i = 0;
    client.commands.clear();
    Commands.forEach((command) => {
        try {
            if (command.enabled === false) return;
            if (command.cooldown) {
                client.cooldowns.set(command.data?.name, new Collection());
            }

            client.commands.set(command.data.name, command);
            i++;
        } catch (error) {
            throw error;
        }
    });
    client.rest.put(
        Routes.applicationGuildCommands(
            client.config.bot.id,
            client.config.serverId,
        ),
        {
            body: SlashCommandsData,
        },
    );

    return client.info(colors.blue(`loaded ${i} commands.`));
};
