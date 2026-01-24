/**
 * Manages the database methods.
 * @abstract
 */
class BaseManager {
  /**
   * The database manager that instantiated this Manager
   * @type {import("@lib/index").DiscordClient}
   * @readonly
   */
  client;

  constructor(client) {
    this.client = client;
  }
}

module.exports = BaseManager;
