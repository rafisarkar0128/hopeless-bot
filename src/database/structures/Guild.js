const Base = require("./Base.js");

/**
 * Represents a discord guild (or a server) on Database.
 * @extends {Base}
 */
class Guild extends Base {
  /**
   * The id of the guild
   * @type {string}
   * @readonly
   */
  _id;

  /**
   * The name of the guild
   * @type {string}
   * @readonly
   */
  name;

  /**
   * The language of the guild
   * @type {string|null}
   * @readonly
   */
  locale;

  /**
   * The prefix of the guild
   * @type {string|null}
   * @readonly
   */
  prefix;

  /**
   * The guild owner id
   * @type {string}
   * @readonly
   */
  ownerId;

  /**
   * The time the client user joined the guild
   * @type {Date}
   * @readonly
   */
  joinedAt;

  /**
   * The time the client user left the server
   * @type {Date|null}
   * @readonly
   */
  leftAt;

  /**
   * The time the guild schema was created
   * @type {Date}
   * @readonly
   */
  createdAt;

  /**
   * The time this schema was last updated
   * @type {Date}
   * @readonly
   */
  updatedAt;

  constructor(client, data) {
    super(client);

    this._id = data._id;
    this.name = data.name;
    this.locale = data.locale ?? null;
    this.prefix = data.prefix ?? null;
    this.ownerId = data.ownerId;
    this.joinedAt = data.joinedAt;
    this.leftAt = data.leftAt || null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Updates a specific field in the guild data
   * @param {string} key - The field to update
   * @param {any} value - The new value
   * @returns {Promise<Guild>} The updated guild instance
   * @example
   * await guild.update('prefix', '!');
   */
  async update(key, value) {
    const updated = await this.client.mongodb.guilds.update(this._id, key, value);
    // Update local instance properties
    this[key] = value;
    this.updatedAt = updated.updatedAt;
    return this;
  }

  /**
   * Deletes this guild from the database
   * @returns {Promise<Guild>} The deleted guild instance
   * @example
   * await guild.delete();
   */
  async delete() {
    return await this.client.mongodb.guilds.delete(this._id);
  }

  /**
   * Refreshes the guild data from the database
   * @returns {Promise<Guild>} The refreshed guild instance
   * @example
   * await guild.refresh();
   */
  async refresh() {
    const fresh = await this.client.mongodb.guilds.get(this._id);
    if (!fresh) throw new Error(`Guild ${this._id} no longer exists`);

    // Update all properties
    Object.assign(this, fresh);
    return this;
  }

  /**
   * Sets the guild prefix
   * @param {string} prefix - The new prefix
   * @returns {Promise<Guild>}
   * @example
   * await guild.setPrefix('!');
   */
  async setPrefix(prefix) {
    return await this.update("prefix", prefix);
  }

  /**
   * Sets the guild locale
   * @param {string} locale - The new locale
   * @returns {Promise<Guild>}
   * @example
   * await guild.setLocale('en-US');
   */
  async setLocale(locale) {
    return await this.update("locale", locale);
  }
}

module.exports = Guild;
