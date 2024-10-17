const { ActivityType } = require("discord.js");

/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
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
        name: `With ${client.guilds.cache
          .reduce((a, b) => a + b.memberCount, 0)
          .toLocaleString()} Users.`,
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
    }, 60e3);
  },
};
