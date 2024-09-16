/**
 * @param {import("../structures/DiscordBot.js").DiscordBot} client
 */
module.exports = async (client) => {
    let fetchedCommands = [];

    let globalCommands = await client.application.commands.fetch({
        withLocalizations: true,
    });
    globalCommands.forEach((command) => {
        fetchedCommands.push(command.toJSON());
    });

    let guildCommands = await client.application.commands.fetch({
        guildId: client.config.serverId,
        withLocalizations: true,
    });
    guildCommands.forEach((command) => {
        fetchedCommands.push(command.toJSON());
    });

    return fetchedCommands;
};
