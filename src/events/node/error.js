const { BaseEvent } = require("@src/structures");
const chalk = require("chalk");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
class Event extends BaseEvent {
  constructor() {
    super({
      name: "error",
      node: true,
    });
  }

  /**
   * Execute function for this event
   * @param {import("@src/lib").DiscordClient} client
   * @param {import("lavalink-client").LavalinkNode} node
   * @param {Error} error
   * @param {unknown} [payload]
   * @returns {Promise<void>}
   */
  async execute(client, node, error, payload) {
    client.logger.error(`Lavalink node (${chalk.magenta(node.id)}) errored:`, error);
    // console.error(error);
  }
}

module.exports = { Event };
