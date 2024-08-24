const { ActivityType, Client } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    rest: false,
    /**
     *
     * @param {Client} client
     */
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
            {
                name: "Bhoot FM",
                type: ActivityType.Listening,
                state: "Bhoot FM - the night comes alive with gramenphone.",
            },
        ];

        client.user.setStatus("idle");

        let i = 0;

        setInterval(() => {
            client.user.setPresence(activities[i]);
            i++;
            if (i >= activities.length) i = 0;
        }, 120e3);
    },
};
