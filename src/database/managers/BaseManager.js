/**
 * Manages the database methods.
 * @abstract
 */
class BaseManager {
  constructor(client) {
    /**
     * The database manager that instantiated this Manager
     * @type {import("@lib/index").DiscordClient}
     * @readonly
     */
    this.client = client;
  }
}

module.exports = BaseManager;
