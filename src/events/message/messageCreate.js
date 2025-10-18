const { BaseEvent } = require("@structures/index");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({
      name: "messageCreate",
    });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param  {import("discord.js").Message} message
   * @returns {Promise<void>}
   */
  async execute(client, message) {
    if (message.author.bot) return;
    if (!message.content || message.content.length === 0) return;

    // Fetch guild metadata from the database
    let metadata = await client.mongodb.guilds.get(message.guildId);
    if (!metadata) {
      metadata = await client.mongodb.guilds.create(message.guildId);
    }

    // For only mentions
    const onlyMention = new RegExp(`^<@!?${client.user?.id}>( |)$`);

    // if the message is only a mention, reply with the prefix
    if (onlyMention.test(message.content)) {
      await client.handlers.handleMention(message, metadata);
      return;
    }

    // The prefix from the database.
    const { prefix } = metadata;

    // A function to escape regex special characters in the prefix
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // For both mention and prefix
    const prefixRegex = new RegExp(`^(<@!?${client.user?.id}>|${escapeRegex(prefix)})\\s*`);

    // If the message starts with a mention or prefix, handle it as a prefix command
    if (prefixRegex.test(message.content)) {
      // else handle it as a prefix command
      await client.handlers.handlePrefix(message, metadata, prefixRegex);
      return;
    }
  }
};
