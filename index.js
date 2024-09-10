require("dotenv").config();
const { GatewayIntentBits, Partials } = require("discord.js");
const { DiscordBot } = require("./src/structures/DiscordBot.js");
const colors = require("colors");
const pkg = require("./package.json");
const { initializeMongoose } = require("./src/database/connect.js");

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

const AntiCrash = require("./src/helpers/AntiCrash.js");
if (client.config.antiCrash) AntiCrash();

client.logger.log("test");

async function startBot() {
  console.clear();

  try {
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
          left: 8,
          right: 8,
          top: 1,
          bottom: 1,
        },
      }
    );
    client.login(client.config.bot.token);
    await client.loadEvents(client, `${process.cwd()}/src/events`);
    await client.loadCommands(client, `${process.cwd()}/src/commands`);
    initializeMongoose(client);
  } catch (error) {
    throw error;
  }
}

startBot().catch((error) => {
  throw error;
});

module.exports = client;

// register extenders
//require("@helpers/extenders/Message");
//require("@helpers/extenders/Guild");
//require("@helpers/extenders/GuildChannel");
//
//const { checkForUpdates } = require("@helpers/BotUtils");
//const { initializeMongoose } = require("@src/database/mongoose");
//const { BotClient } = require("@src/structures");
//const { validateConfiguration } = require("@helpers/Validator");
//
//validateConfiguration();
//
//// initialize client
//
//
//// find unhandled promise rejections
//process.on("unhandledRejection", (err) =>
//  client.logger.error(`Unhandled exception`, err)
//);
//
//(async () => {
//  // check for updates
//  await checkForUpdates();
//
//  // start the dashboard
//  if (client.config.DASHBOARD.enabled) {
//    client.logger.log("Launching dashboard");
//    try {
//      const { launch } = require("@root/dashboard/app");
//
//      // let the dashboard initialize the database
//      await launch(client);
//    } catch (ex) {
//      client.logger.error("Failed to launch dashboard", ex);
//    }
//  } else {
//    // initialize the database
//    await initializeMongoose();
//  }
//
//  // start the client
//  await client.login(process.env.BOT_TOKEN);
//})();
//
