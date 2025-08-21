const { BaseEvent } = require("@src/structures");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");

/**
 * A new Event extended from BaseEvent
 * @extends {BaseEvent}
 */
class Event extends BaseEvent {
  constructor() {
    super({
      name: "ready",
      once: true,
    });
  }

  /**
   * Execute function for this event
   * @param {import("@src/lib").DiscordClient} client
   * @returns {Promise<void>}
   */
  async execute(client) {
    client.logger.success(`Ready! ${chalk.green(client.user.tag)} is online`);

    await client.db.connect();
    await client.lavalink.init(client.user);
    // await client.helpers.syncCommands(client);

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
}

module.exports = { Event };
