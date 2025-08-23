const { BaseEvent } = require("@src/structures");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "",
      once: false,
      rest: false,
      ws: false,
      node: false,
      lavalink: false,
      disabled: false,
    });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @returns {Promise<void>}
   */
  async execute(client) {
    return client.logger.info(`${this.name} works fine!`);
  }
};
