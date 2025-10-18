const chalk = require("chalk");

/**
 * @typedef {import("discord.js").APIApplicationCommand & { global: boolean }} OldCommand
 * The old command structure used in the bot
 */

/**
 * A function to fetch Application Commands
 * @param {import("@src/lib").DiscordClient} client The Discord client
 * @returns {Promise<OldCommand[]>} The fetched application commands
 */
async function fetchCommands(client) {
  const ApplicationCommands = [];

  try {
    if (client.config.debug) {
      client.logger.debug("Fetching global and guild commands via REST API");
    }

    const globalCommands = await client.rest.get(
      `/applications/${client.application.id}/commands`,
      { query: "with_localizations=true" }
    );

    if (globalCommands.length > 0) {
      for (const command of globalCommands) {
        ApplicationCommands.push({ ...command, global: true });
      }
    }

    const guildCommands = await client.rest.get(
      `/applications/${client.application.id}/guilds/${client.config.bot.guildId}/commands`,
      { query: "with_localizations=true" }
    );

    if (guildCommands.length > 0) {
      for (const command of guildCommands) {
        ApplicationCommands.push({ ...command, global: false });
      }
    }

    if (client.config.mode === "development") {
      client.logger.info(
        `Fetched total ${chalk.yellow(globalCommands.length + guildCommands.length)} commands. (${chalk.cyan(globalCommands.length)} global, ${chalk.green(guildCommands.length)} guild)`
      );
    }
  } catch (error) {
    client.logger.error(error);
  }

  return ApplicationCommands;
}

module.exports = { fetchCommands };
