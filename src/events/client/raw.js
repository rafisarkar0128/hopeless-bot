/** @type {import("@types/events").DiscordEventStructure} */
module.exports = {
    name: "raw",
    once: false,
    rest: false,
    /** @param {import("discord.js").RawFile} data*/
    execute: async (client, data) => {
        // Updating the Moonlink.js package with the necessary data
        client.moonlink.packetUpdate(data);
    },
};
