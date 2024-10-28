const colors = require("colors");
const { fetchCommands } = require("./fetchCommands.js");
const { checkForChange } = require("./checkForChanges.js");

/** A fucntion to synchronize Application Commands
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {import("@types/types").NewCommand[]} newCommands
 * @returns {Promise<void>}
 */
module.exports = async (client) => {
  client.logger.info(__filename, colors.yellow("synchronizing application commands"));

  /**
   * @param {import("@types/types").OldCommand[]} oldCommands
   * @param {} newCommands
   */
  const syncCommands = async (oldCommands, newCommands) => {
    const commandsToAdd = newCommands.filter(
      (command) => !oldCommands.some((c) => c.data.name === command.data.name),
    );
    for (const command of commandsToAdd) {
      const { data, global, disabled } = command;
      try {
        if (disabled) continue;
        await client.application.commands.create(data, global ? "" : guildId);
        console.log(`[${colors.green("ADDED")}] ${colors.magenta(command.data.name)}`);
      } catch (error) {
        errors.push(error);
      }
    }

    const commandsToDelete = oldCommands.filter(
      (command) => !newCommands.some((c) => c.data.name === command.data.name),
    );
    for (const command of commandsToDelete) {
      try {
        await command.data.delete();
        console.log(`[${colors.red("DELETED")}] ${colors.magenta(command.data.name)}`);
      } catch (error) {
        errors.push(error);
      }
    }

    const commandsToModify = newCommands.filter((command) =>
      oldCommands.some((c) => c.data.name === command.data.name),
    );
    for (const newCommand of commandsToModify) {
      try {
        const oldCommand = oldCommands.find((c) => c.data.name === newCommand.data.name);
        const { data, global, disabled } = newCommand;
        if (disabled) {
          await oldCommand.data.delete();

          console.log(`[${colors.red("DELETED")}] ${colors.magenta(data.name)}`);

          continue;
        }

        if (oldCommand.global !== global) {
          await oldCommand.data.delete();
          await client.application.commands.create(data, global ? "" : guildId);

          console.log(`[${colors.yellow("MODIFIED")}] ${colors.magenta(data.name)}`);

          continue;
        }

        if (checkForChange(oldCommand, newCommand)) {
          await client.application.commands.create(data, global ? "" : guildId);

          console.log(`[${colors.yellow("MODIFIED")}] ${colors.magenta(data.name)}`);

          continue;
        }
      } catch (error) {
        errors.push(error);
      }
    }
  };

  const errors = new Array();
  const guildId = client.config.guild_id;
  const oldCommands = await fetchCommands(client);

  const oldSlashCommands = oldCommands.filter((c) => c.data.type === 1);
  const newSlashCommands = new Array();
  client.slashCommands.forEach((c) => {
    newSlashCommands.push(c);
  });
  await syncCommands(oldSlashCommands, newSlashCommands);

  const oldContextMenuCommands = oldCommands.filter((c) => c.data.type === (2 || 3));
  const newContextMenuCommands = new Array();
  client.contexts.forEach((c) => {
    newContextMenuCommands.push(c);
  });
  await syncCommands(oldContextMenuCommands, newContextMenuCommands);

  console.log(
    `[${colors.cyan("INFO")}] ${colors.green("all application commands are in sync")}`,
  );

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

  client.logger.info(__filename, colors.yellow("synchronization completed"));
};
