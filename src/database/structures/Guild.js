const Base = require("./Base.js");

/**
 * Represents a discord guild (or a server) on Database.
 * @extends {Base}
 */
class Guild extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the guild
     * @type {string}
     * @readonly
     */
    this._id = data._id;

    /**
     * The name of the guild
     * @type {string}
     * @readonly
     */
    this.name = data.name;

    /**
     * The language of the guild
     * @type {string}
     * @readonly
     */
    this.locale = data.locale ?? null;

    /**
     * The language of the guild
     * @type {string}
     * @readonly
     */
    this.prefix = data.prefix ?? null;

    /**
     * The guild owner id
     * @type {string}
     * @readonly
     */
    this.ownerId = data.ownerId;

    /**
     * The time the the client user joined the guild
     * @type {Date}
     * @readonly
     */
    this.joinedAt = data.joinedAt;

    /**
     * The time the client user left the server
     * @type {Date|null}
     * @readonly
     */
    this.leftAt = data.leftAt || null;

    /**
     * The time the guild schema was created
     * @type {Date}
     * @readonly
     */
    this.createdAt = data.createdAt;

    /**
     * The time this schema was last updated
     * @type {Date}
     * @readonly
     */
    this.updatedAt = data.updatedAt;
  }
}

module.exports = Guild;
