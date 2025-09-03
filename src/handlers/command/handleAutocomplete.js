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

  try {
    return await command.autocomplete(client, interaction);
  } catch (error) {
    null;
  }
}

module.exports = { handleAutocomplete };
