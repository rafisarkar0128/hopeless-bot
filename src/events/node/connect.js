const { BaseEvent } = require("@src/structures");
const chalk = require("chalk");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
class Event extends BaseEvent {
  constructor() {
    super({
      name: "connect",
      node: true,
    });
  }

  /**
   * Execute function for this event
   * @param {import("@src/lib").DiscordClient} client
   * @param  {import("lavalink-client").LavalinkNode} node
   * @returns {Promise<void>}
   */
  async execute(client, node) {
    client.logger.success(`Lavalink node (${chalk.magenta(node.id)}) connected.`);
  }
}

module.exports = { Event };
