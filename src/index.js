require("dotenv").config();
const AntiCrash = require("./helpers/AntiCrash.js");
const config = require("./config.js");
if (config.antiCrash.enable) AntiCrash();

const { GatewayIntentBits, Partials } = require("discord.js");
const { DiscordBot } = require("./structures/DiscordBot.js");
const colors = require("colors");
const pkg = require("../package.json");
const { initializeMongoose } = require("./database/connect.js");

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

async function startBot() {
  console.clear();
  await client.logBox();

  try {
    await client.loadEvents();
    await client.loadCommands(client, `${process.cwd()}/src/commands`);
    await initializeMongoose(client);
    client.login(client.config.bot.token);
  } catch (error) {
    throw error;
  }
}

startBot().catch((error) => {
  throw error;
});

module.exports = client;
