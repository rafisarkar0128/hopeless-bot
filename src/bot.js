require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
        Partials.Channel,
        Partials.ThreadMember,
    ],
    allowedMentions: {
        repliedUser: false,
    },
    failIfNotExists: true,
});

client.commands = new Collection();
client.events = new Collection();
client.subCommands = new Collection();

const { config, colors, emojis } = require("./config.js");

client.config = config;
client.colors = colors;
client.emojis = emojis;

client.log = require("./functions/log.js");
client.loadFiles = require("./functions/loadFiles.js");
client.getMemberCount = require("./functions/getMemberCount.js");

const { loadCommands } = require("./handlers/commands.js");
const { loadEvents } = require("./handlers/events.js");
const { loadErrors } = require("./handlers/errors");

async function startBot() {
    try {
        await loadErrors();
        await loadEvents(client, "src/events");
        await loadCommands(client, "src/commands");
        client.login(config.token);
    } catch (error) {
        throw error;
    }
}

module.exports = { startBot };
