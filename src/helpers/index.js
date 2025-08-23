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

//Exporting all the functions from single file for better accessibility
module.exports = {
  loadWelcome,
  antiCrash,
  loadEvents,
  loadLocales,
  loadCommands,
  validateConfig,
  fetchCommands,
  checkForChangesInCommand,
  checkForChangesInOptions,
  checkForChangesInChoices,
  checkForChangesInLocalizations,
  syncCommands,
};
