const { Routes } = require("discord.js");
const colors = require("colors");
const fetchCommands = require("./fetchCommands.js");
const checkForChange = require("./checkForChanges.js");

/** @type {import("@src/index").SyncCommands} */
module.exports = async (client, newCommands) => {
    client.logger.info(colors.yellow("synchronizing application commands"));

    const errors = new Array();
    const { bot, serverId } = client.config;
    const oldCommands = await fetchCommands(client);

    try {
        client.logger.log(
            `[${colors.cyan("INFO")}] ${colors.blue(
                "checking for changes in application command data",
            )}`,
        );

        newCommands.forEach(async (newCommand) => {
            try {
                const { name, type } = newCommand.data;
                const oldCommand = oldCommands.find(
                    (c) => c.name == name && c.type == type,
                );

                const change = await checkForChange(newCommand, oldCommand);
                console.log(change);
            } catch (error) {
                errors.push(error);
            }
        });

        let tempC = [];
        newCommands.forEach(async (command) => {
            tempC.push(command.data);
        });

        client.rest.put(Routes.applicationGuildCommands(bot.id, serverId), {
            body: tempC,
        });
    } catch (error) {
        errors.push(error);
    }

    if (errors.length > 0) {
        console.log(
            colors.yellow(
                "[AntiCrash] | [Synchronization_Error_Logs] | [Start]  : ===============",
            ),
        );
        errors.forEach((error) => {
            console.log(colors.red(error));
        });
        console.log(
            colors.yellow(
                "[AntiCrash] | [Synchronization_Error_Logs] | [End] : ===============",
            ),
        );
    }

    return client.logger.info(colors.yellow("synchronized application commands"));
};
