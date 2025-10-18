const { BaseEvent } = require("@src/structures");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "guildDelete" });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Guild} guild
   * @returns {Promise<void>}
   */
  async execute(client, guild) {
    if (!guild) return;
    await client.mongodb.guilds.update(guild.id, "leftAt", new Date());
    await client.handlers.handleLeaveLogs(guild);
  }
};
