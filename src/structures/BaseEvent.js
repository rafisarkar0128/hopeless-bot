/**
 * All lavalink event names for auto completion
 * @typedef {import("lavalink-client").LavalinkManagerEvents & import("lavalink-client").NodeManagerEvents} LavalinkEvents
 */

/**
 * All event names for auto completion
 * @typedef {import("discord.js").ClientEvents & LavalinkEvents} AllEvents
 */

/**
 * Event options to handle events
 * @typedef {Object} EventOptions
 * @property {keyof AllEvents} name The name of the event (required).
 * @property {?boolean} [once] Whether this event should be executed once or not.
 * @property {?boolean} [rest] Whether this is a rest (discord api) event or not.
 * @property {?boolean} [ws] Whether this is a ws (websocket) event or not.
 * @property {?boolean} [node] Whether this is a node (lavalink node) event or not.
 * @property {?boolean} [player] Whether this is a player (lavalink player) event or not.
 * @property {boolean} [disabled] Wether this event is disabled or not.
 */

/**
 * The base for the events.
 * @abstract
 */
class BaseEvent {
  /**
   * The name of the event (required).
   * @type {string}
   */
  name;

  /**
   * Whether this event should be executed once or not.
   * @type {boolean}
   */
  once;

  /**
   * Whether this is a rest (discord api) event or not.
   * @type {boolean}
   */
  rest;

  /**
   * Whether this is a ws (websocket) event or not.
   * @type {boolean}
   */
  ws;

  /**
   * Whether this is a node (lavalink node) event or not.
   * @type {boolean}
   */
  node;

  /**
   * Whether this is a lavalink (player) event or not.
   * @type {boolean}
   */
  player;

  /**
   * Wether this event is disabled or not.
   * @type {boolean}
   */
  disabled;

  /**
   * Typings event options.
   * @param {EventOptions} options The options to initialize the event with
   */
  constructor(options) {
    this.name = options.name ?? "";
    this.once = options.once ?? false;
    this.rest = options.rest ?? false;
    this.ws = options.ws ?? false;
    this.node = options.node ?? false;
    this.player = options.player ?? false;
    this.disabled = options.disabled ?? false;
  }

  /**
   * Default execute function for the event
   * @returns {Promise<void>}
   */
  async execute() {
    return await Promise.resolve();
  }
}

module.exports = { BaseEvent };
