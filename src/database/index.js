// Database Manager
const { DatabaseManager } = require("./DatabaseManager");

// Managers & Structures ( for easier type importing )
const Managers = require("./managers/index.js");
const Structures = require("./structures/index.js");

// Export all modules
module.exports = { DatabaseManager, Managers, Structures };
