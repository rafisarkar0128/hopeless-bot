require("dotenv").config();
const config = require("./config.js");
if (config.antiCrash.enable) require("./helpers/AntiCrash.js");

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
  await client.logBox(
    [
      `Welcome to ${colors.blue(pkg.name.toUpperCase())} github project`,
      `Running on Node.Js ${colors.green(process.version)}`,
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
    }
  );

  try {
    await client.loadEvents("events");
    await client.login(client.config.bot.token);
    initializeMongoose(client);
  } catch (error) {
    throw error;
  }
}

startBot().catch((error) => {
  throw error;
});

module.exports = client;
