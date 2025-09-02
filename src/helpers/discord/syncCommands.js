const chalk = require("chalk");
const { fetchCommands } = require("./fetchCommands.js");
const { checkForChangesInCommand } = require("./checkForChanges.js");

/**
 * A function to synchronize Application Commands
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 */
async function syncCommands(client) {
  const { guildId } = client.config.bot;
  const oldCommands = await fetchCommands(client);

  const guildCommands = [];
  const globalCommands = [];

  for (const [name, command] of client.commands) {
    if (client.config.bot.debug) {
      client.logger.debug(`${chalk.green("ADDED")} command ${chalk.yellow(command.data.name)}`);
    }

    if (command.options.global) globalCommands.push(command.data.toJSON());
    else guildCommands.push(command.data.toJSON());
  }

  await client.application.commands.set(globalCommands);
  await client.application.commands.set(guildCommands, guildId);

  if (oldCommands.length >= 0) {
    for (const oldCommand of oldCommands) {
      client.logger.debug(`Found old command: ${oldCommand.name} -->`);
      // console.log(oldCommand);
    }
  }

  // This section is for the very first time when the commands are not registered
  // or when the bot's commands are removed from discord
  // if (oldCommands.length <= 0) {
  //   const guildCommands = [];
  //   const globalCommands = [];
  //
  //   client.commands.forEach((command) => {
  //     // client.logger.info(
  //     //   `${chalk.greenBright("ADDED")} command ${chalk.yellowBright(command.data.name)}`
  //     // );
  //
  //     if (command.global) globalCommands.push(command.data.toJSON());
  //     else guildCommands.push(command.data.toJSON());
  //   });
  //
  //   if (guildCommands.length > 0) {
  //     await client.application.commands.set(guildCommands, guildId);
  //   }
  //
  //   if (globalCommands.length > 0) {
  //     await client.application.commands.set(globalCommands);
  //   }
  // }

  // This section is for the rest of the time when the commands are already registered
  // and we need to check for changes
  // else {
  //   // Checking for new commands and pushing them to discord
  //   const commandsToAdd = client.commands
  //     .filter((command) => !oldCommands.some((c) => c.data.name === command.data.name))
  //     .map((c) => c);
  //
  //   for (const command of commandsToAdd) {
  //     try {
  //       if (command.global) {
  //         await client.application.commands.create(command.data);
  //       } else {
  //         await client.application.commands.create(command.data, guildId);
  //       }
  //
  //       if (showSyncLogs) {
  //         client.logger.info(
  //           `[${chalk.greenBright("ADDED")}]: command ${chalk.cyanBright(command.data.name)}`
  //         );
  //       }
  //     } catch (error) {
  //       client.logger.error(error);
  //     }
  //   }
  //
  //   // Checking old commands and deleting them if the file is removed or command is disabled
  //   const commandsToDelete = oldCommands
  //     .filter((command) => !client.commands.some((c) => c.data.name === command.data.name))
  //     .map((c) => c);
  //
  //   for (const command of commandsToDelete) {
  //     try {
  //       await command.data.delete();
  //
  //       if (showSyncLogs) {
  //         client.logger.info(
  //           `[${chalk.redBright("DELETED")}]: command ${chalk.cyanBright(command.data.name)}`
  //         );
  //       }
  //     } catch (error) {
  //       client.logger.error(error);
  //     }
  //   }
  //
  //   // Checking for changes in commands and pushing the changes to discord
  //   const commandsToModify = client.commands
  //     .filter((command) => oldCommands.some((c) => c.data.name === command.data.name))
  //     .map((c) => c);
  //
  //   for (const newCommand of commandsToModify) {
  //     try {
  //       const oldCommand = oldCommands.find((c) => c.data.name === newCommand.data.name);
  //       let isChanged = false;
  //
  //       // Check if the command is global or not
  //       if (oldCommand.global !== newCommand.global) {
  //         isChanged = true;
  //       }
  //
  //       // Check if the command has been modified or not
  //       else if (checkForChangesInCommand(oldCommand, newCommand)) {
  //         isChanged = true;
  //       }
  //
  //       if (isChanged) {
  //         await oldCommand.data.delete();
  //
  //         if (newCommand.global) {
  //           await client.application.commands.create(newCommand.data);
  //         } else {
  //           await client.application.commands.create(newCommand.data, guildId);
  //         }
  //
  //         if (showSyncLogs) {
  //           client.logger.info(
  //             `[${chalk.yellowBright("MODIFIED")}]: command ${chalk.cyanBright(newCommand.data.name)}`
  //           );
  //         }
  //       }
  //     } catch (error) {
  //       client.logger.error(error);
  //     }
  //   }
  // }

  client.logger.info("Application commands have been synchronized.");
}

module.exports = { syncCommands };
