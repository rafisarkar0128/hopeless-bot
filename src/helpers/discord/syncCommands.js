const chalk = require("chalk");
const { fetchCommands } = require("./fetchCommands.js");
const { checkForChangesInCommand } = require("./checkForChanges.js");

/**
 * A function to synchronize Application Commands
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 */
async function syncCommands(client) {
  client.logger.info("Synchronizing application commands...");
  const { guildId } = client.config.bot;
  const oldCommands = await fetchCommands(client);

  // If in production mode, directly push the changes to Discord
  if (client.config.mode === "production" || oldCommands.length === 0) {
    const guildCommands = [];
    const globalCommands = [];

    // separate global and guild commands
    for (const command of client.applicationCommands) {
      if (command.global) globalCommands.push(command);
      else guildCommands.push(command);
    }

    // Set the commands in Discord
    if (guildCommands.length > 0) {
      await client.application.commands.set(guildCommands, guildId);
    }
    if (globalCommands.length > 0) {
      await client.application.commands.set(globalCommands);
    }
  }

  // If in development mode, log the changes then push to Discord
  else if (client.config.mode === "development") {
    // Check for commands that are in Discord but not in the codebase anymore
    for (const oldCommand of oldCommands) {
      const newCommand = client.applicationCommands.find((c) => c.name === oldCommand.name);

      // If the command is deleted, add it to the delete array
      if (!newCommand) {
        await client.application.commands.delete(
          oldCommand.id,
          oldCommand.global ? undefined : guildId
        );
        client.logger.info(`${chalk.green("DELETED")} command ${chalk.yellow(oldCommand.name)}`);
      }
    }

    // Check for new commands in codebase which are not in Discord and commands that have been modified
    for (const newCommand of client.applicationCommands) {
      const oldCommand = oldCommands.find((c) => c.name === newCommand.name);

      // If the command is new, add it
      if (!oldCommand) {
        await client.application.commands.create(
          newCommand,
          newCommand.global ? undefined : guildId
        );

        client.logger.info(`${chalk.green("ADDED")} command ${chalk.yellow(newCommand.name)}`);
        continue;
      }

      // If the command's scope (global/guild) has changed, delete the old one and add the new one
      if (oldCommand.global !== newCommand.global) {
        await client.application.commands.delete(
          oldCommand.id,
          oldCommand.global ? undefined : guildId
        );
        await client.application.commands.create(
          newCommand,
          newCommand.global ? undefined : guildId
        );

        client.logger.info(
          `${chalk.green("UPDATED")} command ${chalk.yellow(
            newCommand.name
          )} (scope changed from ${oldCommand.global ? "global" : "guild"} to ${
            newCommand.global ? "global" : "guild"
          })`
        );
        continue;
      }

      // If the command exists, check for changes then update it
      if (checkForChangesInCommand(oldCommand, newCommand)) {
        console.log(oldCommand);
        console.log(newCommand);

        await client.application.commands.edit(
          oldCommand.id,
          newCommand,
          oldCommand.global ? undefined : guildId
        );

        client.logger.info(
          `${chalk.green("UPDATED")} command ${chalk.yellow(newCommand.name)} (modified)`
        );
      }
    }
  }

  client.logger.info("Application commands have been synchronized.");
}

module.exports = { syncCommands };
