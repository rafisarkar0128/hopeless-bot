const { Collection, Routes } = require("discord.js");
const colors = require("colors");
const AsciiTable = require("ascii-table");
const fetchSlashCommands = require("./fetchSlashCommands.js");

/**
 * @param {import("../structures/DiscordBot.js").DiscordBot} client
 */
module.exports = async (client) => {
    try {
        let SlashCommands = [];
        client.commands.clear();
        commands.forEach(
            /**
             * @param {import("../structures/CommandStructure.js").CommandStructure} command
             */
            async (command) => {
                try {
                    if (command.enabled === false) return;
                    if (command.cooldown) {
                        client.cooldowns.set(command.data?.name, new Collection());
                    }

                    if (command.aliases?.length) {
                        client.logger.log(command.aliases);
                    }

                    client.commands.set(command.data.name, command);
                    if (command.data) SlashCommands.push(command.data.toJSON());
                } catch (error) {
                    throw error;
                }
            },
        );
        client.info(
            colors.blue(
                `✅ loaded ${colors.yellow(client.commands.size)} command module`,
            ),
        );

        //client.info(colors.yellow("🔎 Checking for changes in Slash Commands"));

        client.logger.write(colors.gray("📩 Fetching slash commands from discord...."));
        await client.wait(2000);
        const fetchtedCommands = await fetchSlashCommands(client);
        client.logger.write(
            colors.yellow(`📦 Found ${fetchtedCommands.length} slash commands.`),
        );

        //console.log(currentSlashCommands.length, currentSlashCommands);
        client.rest.put(
            Routes.applicationGuildCommands(client.config.bot.id, client.config.serverId),
            {
                body: SlashCommands,
            },
        );
    } catch (error) {
        client.logger.error(error);
    }
};
