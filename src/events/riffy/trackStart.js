const { EmbedBuilder } = require("discord.js");

/** @type {import("@structures/event.d.ts").EventStructure} */
module.exports = {
  name: "trackStart",
  once: false,
  riffy: true,
  /**
   * types for parameters
   * @param {import("riffy").Player} player
   * @param {import("riffy").Track} track
   */
  execute: async (client, player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Now Playing`)
          .setDescription(
            `Title: **[${track.info.title}](${track.info.uri})**\nArtist: **${
              track.info.author
            }**\nDuration: **${client.utils.timeFormat(track.info.length)}**`,
          )
          .setThumbnail(track.info.thumbnail)
          .setColor(client.config.colors.Good),
      ],
    });
  },
};
