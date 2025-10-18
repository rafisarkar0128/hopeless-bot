const { handleSlash } = require("./command/handleSlash");
const { handleAutocomplete } = require("./command/handleAutocomplete");
const { handlePrefix } = require("./command/handlePrefix");
const { handleJoinLogs } = require("./logging/handleJoinLogs");
const { handleLeaveLogs } = require("./logging/handleLeaveLogs");
const { handleMention } = require("./message/handleMention");
const { handlePlayerControls } = require("./lavalink/handlePlayerControls");

/**
 * A class to manage various handlers
 * @class
 */
class Handlers {
  constructor(client) {
    if (!client || typeof client !== "object") {
      throw new Error("Client is not defined or not an object.");
    }

    /**
     * The base Discord Client
     * @type {import("@lib/index").DiscordClient}
     */
    this.client = client;

    /**
     * A function to handle AutoComplete Commands
     * @param {import("discord.js").AutocompleteInteraction} interaction
     * @example
     * await client.handlers.handleAutocomplete(interaction);
     */
    this.handleAutocomplete = (interaction) => handleAutocomplete(this.client, interaction);

    /**
     * A function to handle slash commands
     * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
     * @example
     * await client.handlers.handleSlash(interaction);
     */
    this.handleSlash = (interaction) => handleSlash(this.client, interaction);

    /**
     * A function to handle prefix commands
     * @param {import("discord.js").Message} message
     * @param {import("@database/index").Structures.Guild} metadata
     * @param {RegExp} regex
     * @example
     * await client.handlers.handlePrefix(message, metadata);
     */
    this.handlePrefix = (message, metadata, regex) =>
      handlePrefix(this.client, message, metadata, regex);

    /**
     * A function to handle bot mentions in messages
     * @param {import("discord.js").Message} message
     * @param {import("@database/index").Structures.Guild} metadata
     * @example
     * await client.handlers.handleMention(message, metadata);
     */
    this.handleMention = (message, metadata) => handleMention(this.client, message, metadata);

    /**
     * A function to handle join logs
     * @param {import("discord.js").Guild} guild
     * @example
     * await client.handlers.handleJoinLogs(guild);
     */
    this.handleJoinLogs = (guild) => handleJoinLogs(this.client, guild);

    /**
     * A function to handle leave logs
     * @param {import("discord.js").Guild} guild
     * @example
     * await client.handlers.handleLeaveLogs(guild);
     */
    this.handleLeaveLogs = (guild) => handleLeaveLogs(this.client, guild);

    /**
     * A function to handle player controls
     * @param {import("discord.js").Message} message
     * @param {import("lavalink-client").Player} player
     * @example
     * await client.handlers.handlePlayerControls(message, player);
     */
    this.handlePlayerControls = (message, player) =>
      handlePlayerControls(this.client, message, player);
  }
}

module.exports = { Handlers };
