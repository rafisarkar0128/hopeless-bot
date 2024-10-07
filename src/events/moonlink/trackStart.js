const { EmbedBuilder } = require("discord.js");

/** @type {import("@types/events").EventStructure} */
module.exports = {
    name: "trackStart",
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
            .setDescription(`${track.title} is playing now, bringing holiday joy`);
        // Sending a message when the track starts playing
        client.channels.cache.get(player.textChannelId).send({
            embeds: [embed],
        });
    },
};
