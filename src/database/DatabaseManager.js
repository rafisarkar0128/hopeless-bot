const { MongoClient } = require("mongodb");
const chalk = require("chalk");
const { GuildManager } = require("./managers/index.js");

/**
 * A manager to manage all database operations
 * @abstract
 */
class DatabaseManager extends MongoClient {
  /**
   * Bot client as a property of this class
   * @type {import("@lib/index").DiscordClient}
   */
  client;

  /**
   * A manager to manage guild data in database
   * @type {GuildManager}
   */
  guilds;

  /**
   * Bot client to use in this class
   * @param {import("@lib/index").DiscordClient} client
   */
  constructor(client) {
    super(client.config.mongodbUri, client.config.mongodbOptions);

    this.client = client;
    this.guilds = new GuildManager(client);
  }

  /**
   * A function to connect to mongodb through mongoose
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      if (this.client.config.debug) {
        this.client.logger.debug("Connecting to database...");
      }
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
      if (this.client.config.debug) {
        this.client.logger.debug("Disconnecting from database...");
      }
      await super.close();
      this.client.logger.success(`Database (${chalk.magenta("MongoDB")}) disconnected.`);
    } catch (error) {
      this.client.logger.error(`Failed to disconnect from ${chalk.magenta("MongoDB")}: ${error}`);
    }
  }
}

module.exports = { DatabaseManager };
