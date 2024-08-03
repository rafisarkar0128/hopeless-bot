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
                name: `With ${await client.getMemberCount(client)} Users.`,
                type: ActivityType.Playing,
            },
            {
                name: "/help.",
                type: ActivityType.Listening,
            },
        ];
        client.user.setStatus("online");

        let i = 0;

        setInterval(
            () => {
                client.user.setActivity(activities[i]);
                i++;
                if (i >= activities.length) i = 0;
            },
            10 * 60 * 1000
        );
    },
};
