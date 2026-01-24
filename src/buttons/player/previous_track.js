const { BaseButton } = require("@src/structures");
const { t } = require("i18next");

module.exports = class Button extends BaseButton {
  constructor() {
    super({
      data: {
        customId: "previous_track",
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
        playing: true,
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

    if (!player.queue.previous.length > 0) {
      await interaction.channel.send(t("player:noPrevious", { lng: metadata.locale }));
      return;
    }

    if (player.queue.current) player.queue.previous.unshift(player.queue.current);
    await player.play({ track: player.queue.previous[0] });
    await interaction.channel.send({
      content: t("player:previousBy", { lng: metadata.locale, user: `<@${interaction.user.id}>` }),
      allowedMentions: { parse: [] },
    });
    return;
  }
};
