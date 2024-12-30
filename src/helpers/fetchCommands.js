const colors = require("colors");

/** A function to fetch Application Commands
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @returns {Promise<import("@types/commands").OldCommand[]>}
 */
async function fetchCommands(client) {
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
      guildId: client.config.guild_id,
      withLocalizations: true,
    });
    guildCommands.forEach((command) => {
      ApplicationCommands.push({ data: command, global: false }) && g++;
    });
  } catch (error) {
    console.log(
      colors.yellow("[AntiCrash] | [Fetch Error Logs] | [Start]  : ==============="),
    );
    console.log(colors.red(`Error fetching commands: ${error}`));
    console.log(
      colors.yellow("[AntiCrash] | [Fetch Error Logs] | [End] : ==============="),
    );
  }

  client.logger.info(
    __filename,
    colors.magenta("fetched") + ` ${colors.yellow(i + g)} application command(s)`,
  );

  return ApplicationCommands;
}

module.exports = { fetchCommands };
