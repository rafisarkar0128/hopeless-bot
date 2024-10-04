/** @type {import("@types/events").MoonlinkEventStructure} */
module.exports = {
    name: "trackStart",
    moonlink: true,
    /** @param {} node */
    execute: async (client, player, track) => {
        // Sending a message when the track starts playing
        client.channels.cache
            .get(player.textChannelId)
            .send(`${track.title} is playing now, bringing holiday joy`);
    },
};
