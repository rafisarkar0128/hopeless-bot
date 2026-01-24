const { loadWelcome } = require("./core/loadWelcome.js");
const { antiCrash } = require("./core/antiCrash.js");
const { loadEvents } = require("./core/loadEvents.js");
const { loadLocales } = require("./core/loadLocales.js");
const { loadCommands } = require("./core/loadCommands.js");
const { validateConfig } = require("./core/validator.js");
const { fetchCommands } = require("./discord/fetchCommands.js");
const {
  checkForChangesInCommand,
  checkForChangesInOptions,
  checkForChangesInChoices,
  checkForChangesInLocalizations,
} = require("./discord/checkForChanges.js");
const { syncCommands } = require("./discord/syncCommands.js");
const { loadButtons } = require("./core/loadButtons.js");

/**
 * A class representing various helper functions for the bot
 * @class
 * @example
 * const helpers = new Helpers(client);
 * await helpers.loadEvents();
 */
class Helpers {
  /**
   * The base Discord Client
   * @type {import("@lib/index").DiscordClient}
   */
  client;

  // Client-dependent functions (bound in constructor)
  /** A function to log Welcome Message */
  loadWelcome;

  /** A function to handle crashes */
  antiCrash;

  /** A function to load languages */
  loadLocales;

  /** A function to load event files */
  loadEvents;

  /** A function to load command modules */
  loadCommands;

  /** A function to load button handlers */
  loadButtons;

  /** A function to validate the whole configuration */
  validateConfig;

  /** A function to fetch Application Commands */
  fetchCommands;

  /** A function to synchronize Application Commands */
  syncCommands;

  // Static utility functions (don't need client)
  /** A function to check for changes in Application Command Data */
  checkForChangesInCommand = checkForChangesInCommand;

  /** A function to check for changes in options */
  checkForChangesInOptions = checkForChangesInOptions;

  /** A function to check for changes in string option choices */
  checkForChangesInChoices = checkForChangesInChoices;

  /** A function to check for changes in name localizations */
  checkForChangesInLocalizations = checkForChangesInLocalizations;

  constructor(client) {
    if (!client || typeof client !== "object") {
      throw new Error("Client is not defined or not an object.");
    }

    this.client = client;

    // Functions that need client instance - bound in constructor
    this.loadWelcome = () => loadWelcome(this.client);
    this.antiCrash = () => antiCrash(this.client);
    this.loadLocales = () => loadLocales(this.client);
    this.loadEvents = () => loadEvents(this.client);
    this.loadCommands = () => loadCommands(this.client);
    this.loadButtons = () => loadButtons(this.client);
    this.validateConfig = () => validateConfig(this.client);
    this.fetchCommands = () => fetchCommands(this.client);
    this.syncCommands = () => syncCommands(this.client);
  }
}

module.exports = { Helpers };
