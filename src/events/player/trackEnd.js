/** @type {import("@structures/event.d.ts").EventStructure} */
module.exports = {
  name: "trackEnd",
  once: false,
  /**
   * types for parameters
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   * @param {} payload
   * @returns {Promise<void>}
   */
  execute: async (client, player, track, payload) => {
    const guild = this.client.guilds.cache.get(player.guildId);
    if (!guild) return;

    const messageId = player.get("messageId");
    if (!messageId) return;

    const channel = guild.channels.cache.get(player.textChannelId);
    if (!channel) return;

    const message = await channel.messages.fetch(messageId).catch(() => {
      null;
    });
    if (!message) return;

    message.delete().catch(() => {
      null;
    });
  },
};
