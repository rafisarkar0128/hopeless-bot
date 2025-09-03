const { MongoClient } = require("mongodb");
const chalk = require("chalk");

/**
 * A manager to manage all database operations
 * @abstract
 */
class DatabaseManager extends MongoClient {
  /**
   * Bot client to use in this class
   * @param {import("@lib/index").DiscordClient} client
   */
  constructor(client) {
    super(client.config.mongodbUri, client.config.mongodbOptions);

    /**
     * Bot client as a property of this class
     * @type {import("@lib/index").DiscordClient}
     */
    this.client = client;
  }

  /**
   * A function to connect to mongodb through mongoose
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      await super.connect();
      this.client.logger.success(`Database (${chalk.magenta("MongoDB")}) connected.`);
    } catch (error) {
      this.client.logger.error(`Failed to connect to ${chalk.magenta("MongoDB")}: ${error}`);
      process.exit(1);
    }
  }

  /**
   * A function to disconnect from mongodb
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      await super.close();
      this.client.logger.success(`Database (${chalk.magenta("MongoDB")}) disconnected.`);
    } catch (error) {
      this.client.logger.error(`Failed to disconnect from ${chalk.magenta("MongoDB")}: ${error}`);
    }
  }
}

module.exports = { DatabaseManager };
