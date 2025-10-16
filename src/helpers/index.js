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

/**
 * A class representing various helper functions for the bot
 * @class
 * @example
 * const helpers = new Helpers(client);
 * await helpers.loadEvents();
 */
class Helpers {
  constructor(client) {
    if (!client || typeof client !== "object") {
      throw new Error("Client is not defined or not an object.");
    }

    /**
     * The base Discord Client
     * @type {import("@lib/index").DiscordClient}
     */
    this.client = client;

    /**
     * A function to log Welcome Message
     * @example
     * client.helpers.loadWelcome();
     */
    this.loadWelcome = () => loadWelcome(this.client);

    /**
     * A function to handle crashes
     * @example
     * await client.helpers.antiCrash();
     */
    this.antiCrash = () => antiCrash(this.client);

    /**
     * A function to load languages
     * @example
     * await client.helpers.loadLocales();
     */
    this.loadLocales = () => loadLocales(this.client);

    /**
     * A function to load event files
     * @example
     * await client.helpers.loadEvents();
     */
    this.loadEvents = () => loadEvents(this.client);

    /**
     * A function to load command modules
     * @example
     * await client.helpers.loadCommands();
     */
    this.loadCommands = () => loadCommands(this.client);

    /**
     * A function to validate the whole configuration.
     * @example
     * client.helpers.validateConfig();
     */
    this.validateConfig = () => validateConfig(this.client);

    /**
     * A function to fetch Application Commands
     * @example
     * const fetchedCommands = await client.helpers.fetchCommands();
     */
    this.fetchCommands = () => fetchCommands(this.client);

    /**
     * A function to synchronize Application Commands
     * @example
     * await client.helpers.syncCommands();
     */
    this.syncCommands = () => syncCommands(this.client);

    /**
     * A function to check for changes in Application Command Data
     * @type {typeof checkForChangesInCommand}
     * @example
     * const hasChanged = client.helpers.checkForChangesInCommand(oldCommand, newCommand);
     */
    this.checkForChangesInCommand = checkForChangesInCommand;

    /** A function to check for changes in options
     * @type {typeof checkForChangesInOptions}
     * @example
     * const hasChanged = client.helpers.checkForChangesInOptions(oldOptions, newOptions);
     */
    this.checkForChangesInOptions = checkForChangesInOptions;

    /** A function to check for changes in string option choices
     * @type {typeof checkForChangesInChoices}
     * @example
     * const hasChanged = client.helpers.checkForChangesInChoices(oldChoices, newChoices);
     */
    this.checkForChangesInChoices = checkForChangesInChoices;

    /** A function to check for changes in name localizations
     * @type {typeof checkForChangesInLocalizations}
     * @example
     * const hasChanged = client.helpers.checkForChangesInLocalizations(oldLocalizations, newLocalizations);
     */
    this.checkForChangesInLocalizations = checkForChangesInLocalizations;
  }
}

module.exports = { Helpers };
