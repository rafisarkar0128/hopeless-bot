const colors = require("colors");

/** @type {import("@src/index").FetchCommands} */
async function fetchCommands(client) {
    client.logger.write(
        `[${colors.cyan("INFO")}] ${colors.magenta("fetching")} ${colors.blue(
            "commands from discord",
        )}`,
    );

    await client.wait(2000);

    /** @type {import("@src/index").OldCommand} */
    const ApplicationCommands = new Array();
    let i = 0,
        g = 0;

    try {
        const globalCommands = await client.application.commands.fetch({
            withLocalizations: true,
        });
        globalCommands.forEach((command) => {
            ApplicationCommands.push({ data: command, global: true }) && i++;
        });

        const guildCommands = await client.application.commands.fetch({
            guildId: client.config.guildId,
            withLocalizations: true,
        });
        guildCommands.forEach((command) => {
            ApplicationCommands.push({ data: command, global: false }) && g++;
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
        `[${colors.cyan("INFO")}] ${colors.magenta("fetched")} ${colors.blue(
            `${colors.yellow(i)} global & ${colors.yellow(g)} guild command(s)`,
        )}`,
    );

    return ApplicationCommands;
}

module.exports = { fetchCommands };
