/**
 * @typedef {Object} OldCommand
 * @property {boolean} global
 * @property {import("discord.js").ApplicationCommand} data
 */

/**
 * A function to fetch Application Commands
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<OldCommand[]>}
 */
async function fetchCommands(client) {
  const ApplicationCommands = [];

  try {
    if (!client || !client.isReady()) {
      throw new Error("Client is missing or not online.");
    }

    const globalCommands = await client.application.commands.fetch({
      withLocalizations: true,
    });
    globalCommands.forEach((command) => {
      ApplicationCommands.push({ data: command, global: true });
    });

    const guildCommands = await client.application.commands.fetch({
      guildId: client.config.bot.guildId,
      withLocalizations: true,
    });
    guildCommands.forEach((command) => {
      ApplicationCommands.push({ data: command, global: false });
    });
  } catch (error) {
    client.logger.error(error);
  }

  return ApplicationCommands;
}

module.exports = { fetchCommands };
