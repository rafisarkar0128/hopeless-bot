const { BaseEvent } = require("@src/structures");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "playerDisconnect", player: true });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("lavalink-client").Player} player
   * @param {string} voiceChannelId
   * @returns {Promise<void>}
   */
  async execute(client, player, voiceChannelId) {
    /** @type {import("discord.js").TextBasedChannel} */
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;

    try {
      const message = await channel.messages.fetch({
        id: player.getData("messageId"),
        force: true,
      });
      if (message) await message.delete();
    } catch (error) {
      if (client.config.debug) {
        client.logger.debug("Failed to delete message after player disconnect", error);
      }
    }
  }
};
