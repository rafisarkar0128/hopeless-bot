const { BaseButton } = require("@src/structures");
const { t } = require("i18next");

module.exports = class Button extends BaseButton {
  constructor() {
    super({
      data: {
        customId: "open_player_controls",
      },
      options: {
        category: "music",
        global: true,
        disabled: false,
        guildOnly: true,
      },
      player: {
        voice: true,
        active: true,
        playing: false,
      },
    });
  }

  /**
   * Execute function for the button.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async execute(client, interaction, metadata) {
    await interaction.deferUpdate();
    // const player = client.lavalink.players.get(interaction.guildId);
    await interaction.followUp({
      content: "currently unavailable",
      flags: "Ephemeral",
    });
    return;
  }
};
