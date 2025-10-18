const { BaseEvent } = require("@structures/index");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "interactionCreate",
    });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Interaction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // For handling slash commands
    if (interaction.isChatInputCommand()) {
      await client.handlers.handleSlash(interaction);
      return;
    }

    // For handling auto complete interactions
    if (interaction.isAutocomplete()) {
      await client.handlers.handleAutocomplete(interaction);
      return;
    }

    // For handling contextmenu commands
    if (interaction.isContextMenuCommand()) {
      // await client.handlers.handleContext(interaction);
      return;
    }
  }
};
