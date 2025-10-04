const { Collection } = require("discord.js");
const { Guild } = require("../structures/index.js");
const BaseManager = require("./BaseManager.js");

/**
 * Options used to fetch a single guild.
 * @typedef {Object} FetchGuildOptions
 * @property {string} id - The id of the guild to fetch
 * @property {boolean} [force] - Should directly be fetched from database
 */

/**
 * Options used to fetch multiple guilds.
 * @typedef {Object} FetchGuildsOptions
 * @property {number} [limit] - Maximum number of guilds to request
 */

/**
 * Manages Database methods for Guilds and stores their cache.
 * @extends {BaseManager}
 * @abstract
 */
class GuildManager extends BaseManager {
  constructor(client) {
    super(client);
  }

  /**
   * A getter function to get the collection
   * @returns {import("mongodb").Collection}
   * @private
   * @readonly
   */
  get coll() {
    return this.client.mongodb.db().collection("Guilds");
  }

  /**
   * A function to get stored guild data from database
   * @param {string} _id - id of guild
   * @returns {Promise<Guild>|null} The guild data if found, else null
   */
  async get(_id) {
    // Validate the _id parameter
    if (!_id || typeof _id !== "string") {
      throw new TypeError(`Parameter "_id" has to be present and must be a string.`);
    }

    // Try to find the guild in the database
    const data = await this.coll.findOne({ _id });
    return data ? new Guild(this.client, data) : null;
  }

  /**
   * Obtains one or multiple guilds from Database, if it's already available.
   * @param {string|FetchGuildOptions & FetchGuildsOptions} [options] The guild's id or options
   * @returns {Promise<Guild|Collection<string, Guild>>}
   */
  async fetch(options = {}) {
    let id = options.id;
    if (typeof options === "string") id = options;

    // If an ID is provided, fetch a single guild from the database
    if (id) {
      const data = await this.coll.findOne({ _id: id });
      if (data) return new Guild(this.client, data);
    }

    // If no ID is provided, fetch multiple guilds from the database
    const guilds = await this.coll
      .find()
      .limit(options.limit || 200)
      .toArray();

    // Return a collection of guilds
    return guilds.reduce(
      (coll, data) => coll.set(data._id, new Guild(this.client, data)),
      new Collection()
    );
  }

  /**
   * A function to create guild data for database
   * @param {string} _id - id of the guild
   * @returns {Promise<Guild>}
   */
  async create(_id) {
    if (!_id || typeof _id !== "string") {
      throw new TypeError(`Parameter "_id" has to be present and must be a string.`);
    }

    // Check if the guild is a valid guild and not already in the database
    const guild = this.client.guilds.cache.get(_id);
    if (!guild || (await this.coll.findOne({ _id }))) return;

    // await this.client.db.users.create(guild.ownerId);

    // Create the guild data
    const data = {
      _id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
      locale: this.client.config.defaultLocale,
      prefix: this.client.config.bot.prefix,
      joinedAt: guild.joinedAt,
      leftAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if the data has been created successfully
    const result = await this.coll.insertOne(data);
    if (result.insertedCount === 0) {
      throw new Error(`Failed to create guild config with id "${_id}".`);
    }

    // Return the new guild data
    return new Guild(this.client, data);
  }

  /**
   * A function to update the database
   * @param {string} _id - id of the guild
   * @param {string} key - key to update
   * @param {any} value - value to update
   * @returns {Promise<Guild>} The updated guild if successful
   */
  async update(_id, key, value) {
    if (!_id || typeof _id !== "string") {
      throw new TypeError(`Parameter "_id" has to be present and must be a string.`);
    }

    // Check if the guild exists in the database
    const data = await this.coll.findOne({ _id });
    if (!data) {
      throw new Error(`Guild with id "${_id}" not found.`);
    }

    // Update the guild data
    data[key] = value;
    data.updatedAt = new Date();
    const result = await this.coll.updateOne({ _id }, { $set: data }, { upsert: true });
    if (result.modifiedCount === 0) {
      throw new Error(`Failed to update guild with id "${_id}".`);
    }

    // Return the updated guild data
    return new Guild(this.client, data);
  }

  /**
   * A function to delete guild data from database
   * @param {string} _id - id of the guild
   * @returns {Promise<Guild>}
   */
  async delete(_id) {
    if (!_id || typeof _id !== "string") {
      throw new TypeError(`Parameter "_id" has to be present and must be a string.`);
    }

    // Check if the guild exists in the database
    const data = await this.coll.findOne({ _id });
    if (!data) {
      throw new Error(`Guild with id "${_id}" not found.`);
    }

    // Delete the guild from the database
    const result = await this.coll.deleteOne({ _id }, { justOne: true });
    if (result.deletedCount === 0) {
      throw new Error(`Failed to delete guild with id "${_id}".`);
    }

    // Return the deleted guild data
    return new Guild(this.client, data);
  }
}

module.exports = GuildManager;
