const { EmbedBuilder } = require("discord.js");

/** @type {import("@types/events").EventStructure} */
module.exports = {
    name: "trackEnd",
    once: false,
    rest: false,
    ws: false,
    moonlink: true,
    /**
     * @param {import("moonlink.js").Player} player
     * @param {import("moonlink.js").Track} track
     */
    execute: async (client, player, track) => {
        const embed = new EmbedBuilder()
            .setColor(client.colors.DeepSkyBlue)
            .setDescription(`The track is over, but the magic continues`);
        // Sending a message when the track finishes playing
        client.channels.cache.get(player.textChannelId).send({
            embeds: [embed],
        });
    },
};
