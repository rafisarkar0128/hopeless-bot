const { BaseEvent } = require("@src/structures");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
class Event extends BaseEvent {
  constructor() {
    super({
      name: "raw",
    });
  }

  /**
   * Execute function for this event
   * @param {import("@structures/BotClient.js")} client
   * @param  {import("discord.js").GatewayDispatchPayload} d
   * @returns {Promise<void>}
   */
  async execute(client, d) {
    if (client.lavalink) {
      // sending raw voice data to the lavalink manager;
      return await client.lavalink.sendRawData(d);
    }
  }
}

module.exports = { Event };
