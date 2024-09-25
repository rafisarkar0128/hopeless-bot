const { Routes } = require("discord.js");
const colors = require("colors");
const fetchCommands = require("./fetchCommands.js");
const checkForChange = require("./checkForChanges.js");

/** @type {import("@src/index").SyncCommands} */
module.exports = async (client, ApplicationCommands) => {
    try {
        client.logger.info(colors.yellow("synchronizing application commands"));

        const { bot, serverId } = client.config;
        const { globalCommands, guildCommands } = ApplicationCommands;
        const { GlobalCommands, GuildCommands } = await fetchCommands(client);

        client.logger.log(
            `[${colors.cyan("INFO")}] ${colors.blue(
                "checking for changes and updating the commands",
            )}`,
        );

        if (globalCommands && GlobalCommands?.length) {
            // const changes = await checkForChange(globalCommands, GlobalCommands);
            // console.log(changes);

            client.rest.put(Routes.applicationCommands(bot.id), {
                body: globalCommands,
            });
        } else {
            client.rest.put(Routes.applicationCommands(bot.id), {
                body: globalCommands,
            });
        }

        if (guildCommands && GuildCommands?.length) {
            const changes = await checkForChange(guildCommands, GuildCommands);
            console.log(`[${colors.green("DEBUG")}] ${colors.cyan("TESTING")}`);

            client.rest.put(Routes.applicationGuildCommands(bot.id, serverId), {
                body: guildCommands,
            });
        } else {
            client.rest.put(Routes.applicationGuildCommands(bot.id, serverId), {
                body: guildCommands,
            });
        }

        return client.logger.info(colors.yellow("synchronized application commands"));
    } catch (error) {
        client.utils.sendError(error, "internal", {
            origin: `src/${__dirname}/${__filename}`,
        });
        throw error;
    }
};
