const { handleAutoplay } = require("./lavalink/handleAutoplay");
const { handleSlash } = require("./command/handleSlash");
const { handleAutocomplete } = require("./command/handleAutocomplete");
const { handlePrefix } = require("./command/handlePrefix");

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
     * @example
     * await client.handlers.handlePrefix(message);
     */
    this.handlePrefix = (message) => handlePrefix(this.client, message);
  }
}

module.exports = { Handlers, handleAutoplay };
