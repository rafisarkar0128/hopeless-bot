require("dotenv").config();
const { GatewayIntentBits, Partials } = require("discord.js");

//const { startBot } = require("./src/bot.js");
const { DiscordBot } = require("./src/structures/DiscordBot.js");

const client = new DiscordBot({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
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

try {
	//startBot();
	client.login(client.config.bot.token);
} catch (error) {
	throw error;
}
