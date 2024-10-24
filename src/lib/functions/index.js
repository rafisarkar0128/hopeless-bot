//Exporting all the functions from single file for better accessibility
module.exports = {
  connectdb: require("./conectdb.js"),
  logVanity: require("./logVanity.js"),
  loadFiles: require("./loadFiles.js"),
  loadEvents: require("./loadEvents.js"),
  loadLocales: require("./loadLocales.js"),
  loadCommands: require("./loadCommands.js"),
};
