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

    const mention = new RegExp(`^<@!?${client.user?.id}>( |)$`);

    // if the message is a mention, handle it
    if (mention.test(message.content)) {
      await client.handlers.handleMention(client, message);
    }

    // else handle it as a prefix command
    else {
      await client.handlers.handlePrefix(client, message);
    }
  }
};
