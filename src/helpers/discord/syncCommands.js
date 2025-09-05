const chalk = require("chalk");
const { fetchCommands } = require("./fetchCommands.js");
const { checkForChangesInCommand } = require("./checkForChanges.js");

/**
 * A function to synchronize Application Commands
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 */
async function syncCommands(client) {
  if (!client || typeof client !== "object") {
    throw new Error("Client parameter is missing or not an object.");
  }

  client.logger.info("Synchronizing application commands...");
  const { guildId } = client.config.bot;
  const oldCommands = await fetchCommands(client);

  const commandsToAdd = [];
  const commandsToUpdate = [];
  const commandsToDelete = [];
  const guildCommands = [];
  const globalCommands = [];

  // Check for new commands in codebase which are not in Discord and commands that have been modified
  for (const newCommand of client.applicationCommands) {
    const oldCommand = oldCommands.find((c) => c.name === newCommand.name);
    if (!oldCommand) {
      if (client.config.mode === "development") {
        client.logger.debug(`${chalk.green("ADDED")} command ${chalk.yellow(newCommand.name)}`);
        commandsToAdd.push(newCommand);
      } else {
        if (newCommand.options.global) globalCommands.push(newCommand);
        else guildCommands.push(newCommand);
      }
      continue;
    }

    if (checkForChangesInCommand(oldCommand, newCommand)) {
      if (client.config.mode === "development") {
        client.logger.debug(`${chalk.green("UPDATED")} command ${chalk.yellow(newCommand.name)}`);
        commandsToUpdate.push(newCommand);
      } else {
        if (newCommand.options.global) globalCommands.push(newCommand);
        else guildCommands.push(newCommand);
      }
    }
  }

  // Check for commands that are in Discord but not in the codebase anymore
  for (const oldCommand of oldCommands) {
    const newCommand = client.applicationCommands.find((c) => c.name === oldCommand.name);
    if (!newCommand) {
      if (client.config.mode === "development") {
        client.logger.debug(`${chalk.green("DELETED")} command ${chalk.yellow(oldCommand.name)}`);
        commandsToDelete.push(oldCommand);
      }
    }
  }

  // if (guildCommands.length > 0) {
  //   await client.application.commands.set(guildCommands, guildId);
  // }
  // if (globalCommands.length > 0) {
  //   await client.application.commands.set(globalCommands);
  // }

  // Checking for changes in commands and pushing the changes to discord
  // for (const newCommand of commandsToUpdate) {
  //   const oldCommand = oldCommands.find((c) => c.data.name === newCommand.data.name);
  //   let isChanged = false;
  //
  //   // Check if the command is global or not
  //   if (oldCommand.global !== newCommand.global) isChanged = true;
  //
  //   // Check if the command has been modified or not
  //   else if (checkForChangesInCommand(oldCommand, newCommand)) isChanged = true;
  // }

  client.logger.info("Application commands have been synchronized.");
}

module.exports = { syncCommands };
