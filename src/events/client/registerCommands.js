const { Collection, Routes } = require("discord.js");
const colors = require("colors");
const AsciiTable = require("ascii-table");

module.exports = {
    name: "ready",
    once: true,
    rest: false,
    /**
     * @param {import("../../structures/DiscordBot.js").DiscordBot} client
     */
    execute: async (client) => {
        try {
            const files = await client.loadFiles("commands");

            //const localCommands = [];
            //for (const file of files) {
            //  const localCommand = require(file);
            //  localCommands.push(localCommand.data.toJSON());
            //}

            const applicationCommands = [];
            client.commands.clear();

            let i = 0,
                p = 0;
            for (const file of files) {
                const command = require(file);

                if (command.enabled === false) continue;
                if (command.cooldown) {
                    client.cooldowns.set(command.data?.name, new Collection());
                }

                applicationCommands.push(command.data);
                client.commands.set(command.data.name, command);
                i++;
            }

            client.rest
                .put(
                    Routes.applicationGuildCommands(
                        client.config.bot.id,
                        client.config.serverId,
                    ),
                    {
                        body: applicationCommands,
                    },
                )
                .catch((error) => {
                    throw error;
                });

            client.info(colors.blue(`loaded ${i} commands.`));

            //for (let localCommand of localCommands) {
            //  client.debug(`${localCommand.name}`);
            //}
        } catch (error) {
            throw error;
        }
    },
};
