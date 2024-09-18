require("dotenv").config();

const { GatewayIntentBits, Partials } = require("discord.js");
const { DiscordBot } = require("./lib/DiscordBot.js");
const config = require("./config.js");
const colors = require("colors");
const pkg = require("../package.json");

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

if (config.antiCrash.enabled) require("./helpers/AntiCrash.js")(client);

client.startBot();

module.exports = client;
