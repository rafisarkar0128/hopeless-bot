const { BaseEvent } = require("@src/structures");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "playerDestroy", player: true });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("lavalink-client").Player} player
   * @param {string} reason
   * @returns {Promise<void>}
   */
  async execute(client, player, reason) {
    /** @type {import("discord.js").TextBasedChannel} */
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;

    const message = await channel.messages.fetch(player.get("messageId"));
    if (!message || !message.deletable) return;

    await message.delete().catch(() => null);
  }
};
