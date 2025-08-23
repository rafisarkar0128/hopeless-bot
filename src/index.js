console.clear(); // clearing the console before initializing.
require("dotenv").config({ quiet: true }); // Load environment variables from .env file
require("module-alias/register"); // Register module aliases

// Initializing the main client
const { DiscordClient } = require("@lib/index");
const client = new DiscordClient();

// Start the bot and handle any errors
client.start();
