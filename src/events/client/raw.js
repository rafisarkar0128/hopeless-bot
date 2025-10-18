const { BaseEvent } = require("@structures/index");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "raw" });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param  {import("discord.js").GatewayDispatchPayload} d
   * @returns {Promise<void>}
   */
  async execute(client, d) {
    // sending raw voice data to the lavalink manager;
    await client.lavalink.sendRawData(d);
  }
};
