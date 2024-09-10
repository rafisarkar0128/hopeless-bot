require("dotenv").config();
require("colors");
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
client.cooldowns = new Collection();

const { log, mainLogBox, logBox } = require("./utils/log.utils.js");
const pkg = require(`${process.cwd()}/package.json`);

client.config = require(`${process.cwd()}/config.js`);
client.colors = require(`${process.cwd()}/colors.json`);
client.log = log;
client.logBox = logBox;
client.pkg = pkg;

const { loadCommands } = require("./handlers/commands.js");
const { loadEvents } = require("./handlers/events.js");
const { loadErrors } = require("./handlers/errors.js");

async function startBot() {
  try {
    await loadErrors(client);
    await mainLogBox(pkg);
    await loadEvents(client);
    await loadCommands(client);
    client.login(client.config.bot.token);
  } catch (error) {
    throw error;
  }
}

module.exports = { startBot };
