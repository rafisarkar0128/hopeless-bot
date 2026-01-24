const { BaseButton } = require("@src/structures");
const { t } = require("i18next");

module.exports = class Button extends BaseButton {
  constructor() {
    super({
      data: {
        customId: "play_pause",
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

    if (player.paused) {
      await player.resume();
      await interaction.channel.send({
        content: t("player:resumedBy", {
          lng: metadata.locale,
          position:
            "`" +
            client.utils.formatTime(player.position, "clock") +
            "/" +
            client.utils.formatTime(player.queue.current.info.duration, "clock") +
            "`",
          user: `<@${interaction.user.id}>`,
        }),
        allowedMentions: { parse: [] },
      });
      return;
    }

    await player.pause();
    await interaction.channel.send({
      content: t("player:pausedBy", {
        lng: metadata.locale,
        position:
          "`" +
          client.utils.formatTime(player.position, "clock") +
          "/" +
          client.utils.formatTime(player.queue.current.info.duration, "clock") +
          "`",
        user: `<@${interaction.user.id}>`,
      }),
      allowedMentions: { parse: [] },
    });
    return;
  }
};
