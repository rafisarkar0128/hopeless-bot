require("dotenv").config(); // Load environment variables from .env file
require("module-alias/register"); // Register module aliases

const { GatewayIntentBits, Partials } = require("discord.js");
const { DiscordBot } = require("@lib/DiscordBot.js");

// Initializing the client with necessary intents and partials
const client = new DiscordBot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.GuildScheduledEvent,
  ],
  allowedMentions: {
    parse: ["users", "roles", "everyone"],
    repliedUser: false,
  },
  failIfNotExists: true,
});

// Start the bot and handle any errors
client.start().catch((error) => {
  throw error;
});

// Exporting the client for other use
module.exports = client;
