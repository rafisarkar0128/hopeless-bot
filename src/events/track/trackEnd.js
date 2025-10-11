const { BaseEvent } = require("@src/structures");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "trackEnd", player: true });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   * @returns {Promise<void>}
   */
  async execute(client, player, track) {
    /** @type {import("discord.js").TextBasedChannel} */
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;

    const message = await channel.messages.fetch(player.get("messageId"));
    if (!message || !message.editable) return;

    await message.edit({ components: [] }).catch(() => null);
  }
};
