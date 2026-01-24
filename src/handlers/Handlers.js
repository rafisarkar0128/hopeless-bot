const { handleSlash } = require("./command/handleSlash");
const { handleAutocomplete } = require("./command/handleAutocomplete");
const { handlePrefix } = require("./command/handlePrefix");
const { handleJoinLogs } = require("./logging/handleJoinLogs");
const { handleLeaveLogs } = require("./logging/handleLeaveLogs");
const { handleMention } = require("./message/handleMention");
const { handlePlayerControls } = require("./lavalink/handlePlayerControls");
const { handleButton } = require("./command/handleButton");

/**
 * A class to manage various handlers
 * @class
 */
class Handlers {
  /**
   * The base Discord Client
   * @type {import("@lib/index").DiscordClient}
   */
  client;

  // Handler functions (bound in constructor)
  /**
   * A function to handle AutoComplete Commands
   * @type {(interaction: import("discord.js").AutocompleteInteraction) => Promise<void>}
   * @example
   * await client.handlers.handleAutocomplete(interaction);
   */
  handleAutocomplete;

  /**
   * A function to handle slash commands
   * @type {(interaction: import("discord.js").ChatInputCommandInteraction<"cached">) => Promise<void>}
   * @example
   * await client.handlers.handleSlash(interaction);
   */
  handleSlash;

  /**
   * A function to handle button interactions
   * @type {(interaction: import("discord.js").ButtonInteraction) => Promise<void>}
   * @example
   * await client.handlers.handleButton(interaction);
   */
  handleButton;

  /**
   * A function to handle prefix commands
   * @type {(message: import("discord.js").Message, metadata: import("@database/index").Structures.Guild, regex: RegExp) => Promise<void>}
   * @example
   * await client.handlers.handlePrefix(message, metadata, regex);
   */
  handlePrefix;

  /**
   * A function to handle bot mentions in messages
   * @type {(message: import("discord.js").Message, metadata: import("@database/index").Structures.Guild) => Promise<void>}
   * @example
   * await client.handlers.handleMention(message, metadata);
   */
  handleMention;

  /**
   * A function to handle join logs
   * @type {(guild: import("discord.js").Guild) => Promise<void>}
   * @example
   * await client.handlers.handleJoinLogs(guild);
   */
  handleJoinLogs;

  /**
   * A function to handle leave logs
   * @type {(guild: import("discord.js").Guild) => Promise<void>}
   * @example
   * await client.handlers.handleLeaveLogs(guild);
   */
  handleLeaveLogs;

  /**
   * A function to handle player controls
   * @type {(message: import("discord.js").Message, player: import("lavalink-client").Player) => Promise<void>}
   * @example
   * await client.handlers.handlePlayerControls(message, player);
   */
  handlePlayerControls;

  constructor(client) {
    if (!client || typeof client !== "object") {
      throw new Error("Client is not defined or not an object.");
    }

    this.client = client;

    // Bind handler functions
    this.handleAutocomplete = (interaction) => handleAutocomplete(this.client, interaction);
    this.handleSlash = (interaction) => handleSlash(this.client, interaction);
    this.handleButton = (interaction) => handleButton(this.client, interaction);
    this.handlePrefix = (message, metadata, regex) =>
      handlePrefix(this.client, message, metadata, regex);
    this.handleMention = (message, metadata) => handleMention(this.client, message, metadata);
    this.handleJoinLogs = (guild) => handleJoinLogs(this.client, guild);
    this.handleLeaveLogs = (guild) => handleLeaveLogs(this.client, guild);
    this.handlePlayerControls = (message, player) =>
      handlePlayerControls(this.client, message, player);
  }
}

module.exports = { Handlers };
