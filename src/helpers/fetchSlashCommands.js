/**
 * @param {import("../lib/DiscordBot.js").DiscordBot} client
 */
module.exports = async (client) => {
    try {
        const fetchedCommands = new Array();
        const globalCommands = await client.application.commands.fetch({
            withLocalizations: true,
        });
        globalCommands.forEach((command) => {
            fetchedCommands.push(command.toJSON());
        });

        const guildCommands = await client.application.commands.fetch({
            guildId: client.config.serverId,
            withLocalizations: true,
        });
        guildCommands.forEach((command) => {
            fetchedCommands.push(command.toJSON());
        });

        return fetchedCommands;
    } catch (error) {
        client.utils.sendError(error, {
            origin: "src/helpers/fetchSlashCommands",
            type: "internal",
        });
        throw error;
    }
};
