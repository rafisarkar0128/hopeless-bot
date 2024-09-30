const colors = require("colors");
const { fetchCommands } = require("./fetchCommands.js");
const { checkForChange } = require("./checkForChanges.js");

/** @type {import("@src/index").SyncCommands} */
async function syncCommands(client, newCommands) {
    client.logger.info(
        `${colors.yellow("synchronizing application commands")} (${colors.gray(
            "This might take time",
        )})`,
    );

    const errors = new Array();
    let i = 0;
    const { guildId } = client.config;
    const oldCommands = await fetchCommands(client);

    const oldSlashCommands = oldCommands.filter((c) => c.data.type === 1);
    const newSlashCommands = newCommands.filter((c) => c.data.type === 1);
    try {
        const commandsToAdd = newSlashCommands.filter(
            (command) => !oldSlashCommands.some((c) => c.data.name === command.data.name),
        );
        for (const command of commandsToAdd) {
            if (command.disabled) continue;

            if (command.global) {
                await client.application.commands.create(command.data);
            } else {
                await client.application.commands.create(command.data, guildId);
            }

            console.log(`[${colors.green("ADDED")}] ${colors.blue(command.data.name)}`);
            i++;
        }

        const commandsToDelete = oldSlashCommands.filter(
            (command) => !newSlashCommands.some((c) => c.data.name === command.data.name),
        );
        for (const command of commandsToDelete) {
            //await command.data.delete();
            console.log(`[${colors.red("DELETED")}] ${colors.cyan(command.data.name)}`);
            i++;
        }

        const commandsToModify = newSlashCommands.filter((command) =>
            oldSlashCommands.some((c) => c.data.name === command.data.name),
        );
        for (const newCommand of commandsToModify) {
            const oldCommand = oldCommands.find(
                (c) => c.data.name === newCommand.data.name,
            );

            if (newCommand.disabled) {
                await oldCommand.data.delete();

                i++;
                console.log(
                    `[${colors.red("DELETED")}] ${colors.cyan(newCommand.data.name)}`,
                );
                continue;
            }

            if (oldCommand.global !== newCommand?.global) {
                await oldCommand.data.delete();

                if (newCommand?.global) {
                    await client.application.commands.create(newCommand.data);
                } else {
                    await client.application.commands.create(newCommand.data, guildId);
                }

                i++;
                console.log(
                    `[${colors.yellow("MODIFIED")}] ${colors.cyan(newCommand.data.name)}`,
                );
                continue;
            }

            if (await checkForChange(oldCommand, newCommand)) {
                if (newCommand?.global) {
                    await client.application.commands.create(newCommand.data);
                } else {
                    await client.application.commands.delete(oldCommand.data.id, guildId);
                }

                i++;
                console.log(
                    `[${colors.yellow("MODIFIED")}] ${colors.cyan(newCommand.data.name)}`,
                );
                continue;
            }
        }
    } catch (error) {
        errors.push(error);
    }

    try {
        const oldContextMenuCommands = oldCommands.filter(
            (c) => c.data.type === (2 || 3),
        );
        const newContextMenuCommands = newCommands.filter(
            (c) => c.data.type === (2 || 3),
        );
    } catch (error) {
        errors.push(error);
    }

    if (i <= 0) {
        console.log(`[${colors.cyan("INFO")}] ${colors.blue("no changes found")}`);
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
}

module.exports = { syncCommands };
