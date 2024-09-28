const colors = require("colors");
const fetchCommands = require("./fetchCommands.js");
const checkForChange = require("./checkForChanges.js");

/** @type {import("@src/index").SyncCommands} */
module.exports = async (client, newCommands) => {
    client.logger.info(colors.yellow("synchronizing application commands"));

    const errors = new Array();
    const Guild = await client.guilds.fetch(client.config.serverId);
    const oldCommands = await fetchCommands(client);
    let i = 0;

    if (oldCommands.length === 0) {
        let globalCommands = new Array();
        let guildCommands = new Array();
        let clogs = new Array();

        for (const command of newCommands) {
            if (command.disabled) continue;

            if (command.global) {
                globalCommands.push(command.data);
            } else {
                guildCommands.push(command.data);
            }

            clogs.push(`[${colors.green("ADDED")}] ${colors.cyan(command.data.name)}`);
        }

        await client.application.commands.set(globalCommands);
        await Guild.commands.set(guildCommands);

        for (const log of clogs) {
            console.log(log);
        }
    }

    for (const newCommand of newCommands) {
        try {
            const oldCommand = oldCommands.find(
                (c) =>
                    c.data.name == newCommand.data.name &&
                    c.data.type == newCommand.data.type,
            );

            if (!oldCommand) {
                if (newCommand.disabled) continue;

                if (newCommand.global) {
                    await client.application.commands.create(newCommand.data);
                } else {
                    await Guild.commands.create(newCommand.data);
                }

                i++;
                console.log(
                    `[${colors.green("ADDED")}] ${colors.cyan(newCommand.data.name)}`,
                );
                continue;
            }

            if (oldCommand && newCommand.disabled) {
                if (oldCommand.global) {
                    await client.application.commands.delete(oldCommand.data.id);
                } else {
                    await Guild.commands.delete(oldCommand.data.id);
                }

                i++;
                console.log(
                    `[${colors.red("DELETED")}] ${colors.cyan(newCommand.data.name)}`,
                );
                continue;
            }

            if (oldCommand && (await checkForChange(oldCommand.data, newCommand.data))) {
                if (newCommand.global) {
                    await client.application.commands.create(newCommand.data);
                } else {
                    await Guild.commands.create(newCommand.data);
                }

                i++;
                console.log(
                    `[${colors.yellow("MODIFIED")}] ${colors.cyan(newCommand.data.name)}`,
                );
                continue;
            }
        } catch (error) {
            errors.push(error);
        }
    }

    if (i <= 0) {
        console.log(
            `[${colors.cyan("INFO")}] ${colors.green(
                "no changes found in application command data",
            )}`,
        );
    }

    if (errors.length > 0) {
        console.log(
            colors.yellow(
                "[AntiCrash] | [Synchronization_Error_Logs] | [Start] : ===============",
            ),
        );
        for (const error of errors) {
            console.log(colors.red(error));
        }
        console.log(
            colors.yellow(
                "[AntiCrash] | [Synchronization_Error_Logs] | [End] : ===============",
            ),
        );
    }

    return client.logger.info(colors.yellow("synchronized application commands"));
};
