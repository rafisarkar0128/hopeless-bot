/**
 * A function to handle AutoComplete Commands
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").AutocompleteInteraction} interaction
 * @returns {Promise<void>}
 */
async function handleAutocomplete(client, interaction) {
  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  if (!command.autocomplete) return;
  if (typeof command.autocomplete !== "function") return;

  try {
    await command.autocomplete(client, interaction);
  } catch (error) {
    client.logger.error("Error handling autocomplete command.");
    if (client.config.debug) client.logger.error(error);
  }
}

module.exports = { handleAutocomplete };
