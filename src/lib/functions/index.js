//Exporting all the functions from single file for better accessibility
module.exports = {
  connectdb: require("./conectdb.js").connectdb,
  logVanity: require("./logVanity.js").logVanity,
  loadFiles: require("./loadFiles.js").loadFiles,
  loadEvents: require("./loadEvents.js").loadEvents,
  loadLocales: require("./loadLocales.js").loadLocales,
  loadCommands: require("./loadCommands.js").loadCommands,
};
