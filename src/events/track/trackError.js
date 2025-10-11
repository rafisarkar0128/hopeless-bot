const { BaseEvent } = require("@src/structures");
const { EmbedBuilder } = require("discord.js");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "trackError", player: true });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   * @param {import("lavalink-client").TrackExceptionEvent} payload
   * @returns {Promise<void>}
   */
  async execute(client, player, track, payload) {
    if (client.config.bot.debug) {
      client.logger.error(
        [
          `A track had an error.`,
          `Track: "${track.info.title}"`,
          `Guild: ${player.guildId}`,
          `Source: "${track.info.sourceName}"`,
          `Error: ${payload.error || payload.exception?.cause || payload.exception?.error || payload.exception?.message}.`,
        ].join("\n")
      );
    } else {
      client.logger.error(`A track had an error in guild ${player.guildId}.`);
    }

    const errorEmbed = new EmbedBuilder()
      .setColor(client.color.Wrong)
      .setTitle("Playback error!")
      .setDescription(`Failed to load track: \`${track.info.title}\``)
      .setFooter({
        text: "Oops! something went wrong but it's not your fault!",
      });

    /** @type {import("discord.js").TextBasedChannel} */
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;

    await channel.send({ embeds: [errorEmbed] });

    const message = await channel.messages.fetch(player.get("messageId"));
    if (!message || !message.editable) return;

    await message.edit({ components: [] }).catch(() => null);
  }
};
