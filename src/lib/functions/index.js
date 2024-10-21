//Exporting all the functions from single file for better accessibility
module.exports = {
  loadFiles: require("./loadFiles.js"),
  connectdb: require("./conectdb.js"),
  loadEvents: require("./loadEvents.js"),
  loadLocales: require("./loadLocales.js"),
  loadCommands: require("./loadCommands.js"),
};
