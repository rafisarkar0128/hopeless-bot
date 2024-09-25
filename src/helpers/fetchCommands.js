const colors = require("colors");

/** @type {import("@src/index").FetchCommands} */
module.exports = async (client) => {
    client.logger.write(
        `[${colors.magenta("FETCHING")}] ${colors.yellow("slash commands from discord")}`,
    );

    const GlobalCommands = new Array();
    const GuildCommands = new Array();

    try {
        const globalCommands = await client.application.commands.fetch({
            withLocalizations: true,
        });
        globalCommands.forEach((command) => {
            GlobalCommands.push(command.toJSON());
        });

        const guildCommands = await client.application.commands.fetch({
            guildId: client.config.serverId,
            withLocalizations: true,
        });
        guildCommands.forEach((command) => {
            GuildCommands.push(command.toJSON());
        });
    } catch (error) {
        client.utils.sendError(error, "fetch", {
            origin: `src/${__dirname}/${__filename}`,
        });
        throw error;
    }

    await client.wait(2000);

    client.logger.log(
        `[${colors.magenta("FOUND")}] ${colors.cyan(
            `${colors.yellow(GlobalCommands?.length)} global command & ${colors.yellow(
                GuildCommands?.length,
            )} guild command`,
        )}`,
    );

    return { GlobalCommands, GuildCommands };
};
