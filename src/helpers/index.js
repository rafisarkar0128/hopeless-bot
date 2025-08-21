const { logVanity } = require("./logVanity.js");
const { loadFiles } = require("./loadFiles.js");
const { antiCrash } = require("./antiCrash.js");
const { loadEvents } = require("./loadEvents.js");
const { loadLocales } = require("./loadLocales.js");
const { loadCommands } = require("./loadCommands.js");
const { validateConfig } = require("./validator.js");
const { getCooldown } = require("./getCooldown.js");
const { fetchCommands } = require("./fetchCommands.js");
const {
  checkForChanges,
  checkForChangesInOptions,
  checkForChangesInChoices,
  checkForChangesInLocalizations,
} = require("./checkForChanges.js");
const { syncCommands } = require("./syncCommands.js");

//Exporting all the functions from single file for better accessibility
module.exports = {
  logVanity,
  loadFiles,
  antiCrash,
  loadEvents,
  loadLocales,
  loadCommands,
  validateConfig,
  getCooldown,
  fetchCommands,
  checkForChanges,
  checkForChangesInOptions,
  checkForChangesInChoices,
  checkForChangesInLocalizations,
  syncCommands,
};
