require("dotenv").config();
require("module-alias/register");

const { AntiCrash } = require("@helpers/AntiCrash.js");
const { GatewayIntentBits, Partials } = require("discord.js");
const { DiscordBot } = require("@lib/DiscordBot.js");
const config = require("@root/src/config/config.js");
const colors = require("colors");
const pkg = require("@root/package.json");

// initializing the client
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
    parse: ["users", "roles"],
    repliedUser: false,
  },
  failIfNotExists: true,
  autoReconnect: true,
  disabledEvents: ["TYPING_START"],
  restTimeOffset: 0,
});

// function to start everything
async function start() {
  if (config.antiCrash.enabled) AntiCrash(client);

  console.clear();
  await client.logBox(
    [
      `Welcome to ${colors.blue(pkg.name.toUpperCase())} js project`,
      `Running on Node.JS ${colors.green(process.version)}`,
      `Version ${colors.yellow(pkg.version)}`,
      `Coded with 💖 by ${colors.cyan(pkg.author.name)}`,
    ].join("\n"),
    {
      borderColor: "#00BFFF",
      textAlignment: "center",
      padding: {
        left: 10,
        right: 10,
        top: 1,
        bottom: 1,
      },
    },
  );

  // Load event modules
  await client.loadEvents("events");

  // Load command modules
  await client.loadCommands("commands");

  // Connect to the database
  await client.database.connect(client);

  // Log into the client
  await client.login(client.config.bot.token);
}

// starting the bot
start().catch((error) => {
  throw error;
});

// exporting the client for other use
module.exports = client;
