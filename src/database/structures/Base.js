const { flatten } = require("discord.js");

/**
 * Represents a data model that is identifiable by a Snowflake
 * @abstract
 */
class Base {
  /**
   * The client that instantiated this Manager
   * @type {import("@lib/index").DiscordClient}
   * @readonly
   */
  client;

  constructor(client) {
    this.client = client;
  }

  toJSON(...props) {
    return flatten(this, ...props);
  }

  valueOf() {
    return this._id;
  }
}

module.exports = Base;
