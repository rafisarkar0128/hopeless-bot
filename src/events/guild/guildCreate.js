const { BaseEvent } = require("@src/structures");

module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "guildCreate" });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @param  {import("discord.js").Guild} guild
   * @returns {Promise<void>}
   */
  async execute(client, guild) {
    if (!guild) return;
    await client.mongodb.guilds.create(guild.id);
    await client.handlers.handleJoinLogs(guild);
  }
};
