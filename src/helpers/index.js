const { connectdb } = require("./conectdb.js");
const { logVanity } = require("./logVanity.js");
const { loadFiles } = require("./loadFiles.js");
const { antiCrash } = require("./antiCrash.js");
const { loadEvents } = require("./loadEvents.js");
const { loadLocales } = require("./loadLocales.js");
const { loadCommands } = require("./loadCommands.js");

//Exporting all the functions from single file for better accessibility
module.exports = {
  connectdb,
  logVanity,
  loadFiles,
  antiCrash,
  loadEvents,
  loadLocales,
  loadCommands,
};
