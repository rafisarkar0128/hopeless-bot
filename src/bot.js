// env variables
require("dotenv").config();

// variables
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require("discord.js");
const { config, colors, emojis } = require("./config.js");
const { log } = require("./functions/log.js");
const { loadFiles } = require("./functions/loadFiles.js");
const { getMemberCount } = require("./functions/getMemberCount.js");

// creating a new client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
        Partials.Channel,
    ],
    allowedMentions: {
        repliedUser: false,
    },
    failIfNotExists: true,
});

// creating some collections
client.commands = new Collection();
client.events = new Collection();

// global functions
client.config = config;
client.colors = colors;
client.emojis = emojis;
client.log = log;
client.loadFiles = loadFiles;
client.getMemberCount = getMemberCount;

// loading functions
const { loadCommands } = require("./handlers/commands.js");
const { loadEvents } = require("./handlers/events.js");
const { loadErrors } = require("./handlers/errors");
//const { sendErrors } = require("./functions/sendErrors");

// function to start everything
async function startBot() {
    try {
        await loadErrors();
        await loadEvents(client, "src/events");
        await loadCommands(client, "src/commands");
        client.login(config.token);
    } catch (error) {
        client.log(error, "error");
    }
}

// exporting the function
module.exports = { startBot };
