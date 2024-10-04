/** @type {import("@types/events").MoonlinkEventStructure} */
module.exports = {
    name: "trackEnd",
    moonlink: true,
    /** @param {} node */
    execute: async (client, player, track) => {
        // Sending a message when the track finishes playing
        client.channels.cache
            .get(player.textChannelId)
            .send(`The track is over, but the magic continues`);
    },
};
