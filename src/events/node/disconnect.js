const { BaseEvent } = require("@structures/index");
const chalk = require("chalk");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "disconnect",
      node: true,
    });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("lavalink-client").LavalinkNode} node
   * @returns {Promise<void>}
   */
  async execute(client, node) {
    client.logger.warn(`Lavalink node (${chalk.magenta(node.id)}) disconnected.`);
  }
};
