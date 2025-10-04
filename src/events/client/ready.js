const { BaseEvent } = require("@structures/index");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
module.exports = class Event extends BaseEvent {
  constructor() {
    super({ name: "clientReady", once: true });
  }

  /**
   * Execute function for this event
   * @param {import("@lib/index").DiscordClient} client
   * @returns {Promise<void>}
   */
  async execute(client) {
    client.logger.success(`Ready! ${chalk.green(client.user.tag)} is online`);

    await client.helpers.syncCommands(client); // Sync application commands
    await client.mongodb.connect(); // Connect to the database
    await client.lavalink.init(client.user); // Initialize Lavalink

    const activities = [
      {
        name: "Slash Commands",
        type: ActivityType.Listening,
      },
      {
        name: `Over ${client.guilds.cache.size} servers.`,
        type: ActivityType.Watching,
      },
      {
        name: `With ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toString()} Users.`,
        type: ActivityType.Playing,
      },
      {
        name: "/help.",
        type: ActivityType.Listening,
      },
    ];
    client.user.setStatus("online");

    let i = 0;
    setInterval(() => {
      client.user.setActivity(activities[i]);
      i++;
      if (i >= activities.length) i = 0;
    }, 300000);
  }
};
