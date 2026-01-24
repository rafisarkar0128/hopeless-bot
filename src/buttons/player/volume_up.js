const { BaseButton } = require("@src/structures");
const { t } = require("i18next");

module.exports = class Button extends BaseButton {
  constructor() {
    super({
      data: {
        customId: "volume_up",
      },
      options: {
        category: "music",
        global: true,
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
    const player = client.lavalink.players.get(interaction.guildId);

    if (player.volume === 200 || player.volume + 10 > 200) {
      await interaction.channel.send(t("player:volumeTooHigh", { lng: metadata.locale }));
      return;
    }

    await player.setVolume(player.volume + 10);
    await interaction.channel.send({
      content: t("player:volumeBy", {
        lng: metadata.locale,
        volume: player.volume,
        user: `<@${interaction.user.id}>`,
      }),
      allowedMentions: { parse: [] },
    });
    return;
  }
};
