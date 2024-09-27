const colors = require("colors");

/** @type {import("@src/index").FetchCommands} */
module.exports = async (client) => {
    client.logger.write(
        `[${colors.magenta("FETCHING")}] ${colors.yellow("slash commands from discord")}`,
    );

    const ApplicationCommands = new Array();
    let i = 0,
        g = 0;

    try {
        const globalCommands = await client.application.commands.fetch({
            withLocalizations: true,
        });
        globalCommands.forEach((command) => {
            ApplicationCommands.push(command.toJSON()) && i++;
        });

        const guildCommands = await client.application.commands.fetch({
            guildId: client.config.serverId,
            withLocalizations: true,
        });
        guildCommands.forEach((command) => {
            ApplicationCommands.push(command.toJSON()) && g++;
        });
    } catch (error) {
        console.log(
            colors.yellow(
                "[AntiCrash] | [Fetch_Error_Logs] | [Start]  : ===============",
            ),
        );
        console.log(colors.red(error));
        console.log(
            colors.yellow("[AntiCrash] | [Fetch_Error_Logs] | [End] : ==============="),
        );
    }

    client.logger.log(
        `[${colors.magenta("FETCHED")}] ${colors.cyan(
            `${colors.yellow(i)} global & ${colors.yellow(g)} guild command(s)`,
        )}`,
    );

    return ApplicationCommands;
};
