const { EmbedBuilder } = require("discord.js");

/** @type {import("@structures/event.d.ts").EventStructure} */
module.exports = {
  name: "trackStart",
  once: false,
  player: true,
  /**
   * types for parameters
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   * @param {any} payload
   */
  execute: async (client, player, track, payload) => {
    const channel = client.channels.cache.get(player.textChannelId);

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(track.info.title)
          .setDescription(`**Duration : ${track.info.duration}**`)
          .setThumbnail(track.info.artworkUrl)
          .setColor(client.config.colors.Good),
      ],
    });
  },
};
