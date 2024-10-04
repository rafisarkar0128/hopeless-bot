const { EmbedBuilder } = require("discord.js");
const { Cluster, Node } = require("lavaclient");
const { load, SpotifyItemType } = require("@lavaclient/spotify");

/**
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @returns {import("lavaclient").Cluster}
 * */
module.exports = async (client) => {
    load({
        client: {
            id: process.env.SPOTIFY_CLIENT_ID,
            secret: process.env.SPOTIFY_CLIENT_SECRET,
        },
        autoResolveYoutubeTracks: false,
        loaders: [
            SpotifyItemType.Album,
            SpotifyItemType.Artist,
            SpotifyItemType.Playlist,
            SpotifyItemType.Track,
        ],
    });

    const prettyMs = (await import("pretty-ms")).default;

    let info = client.config.music.lavalink_nodes;

    const lavaclient = new Cluster({
        nodes: [{ id: "main", info }],
        discord: {
            sendGatewayPayload: (id, payload) =>
                client.guilds.cache.get(id)?.shard?.send(payload),
        },
    });

    client.ws.on("VOICE_SERVER_UPDATE", (data) =>
        lavaclient.players.handleVoiceUpdate(data),
    );
    client.ws.on("VOICE_STATE_UPDATE", (data) =>
        lavaclient.players.handleVoiceUpdate(data),
    );

    lavaclient.on("nodeConnect", (node, event) => {
        client.logger.log(`Node "${node.id}" connected`);
    });

    lavaclient.on("nodeDisconnect", (node, event) => {
        client.logger.log(`Node "${node.id}" disconnected`);
    });

    lavaclient.on("nodeError", (node, error) => {
        client.logger.error(
            `Node "${node.id}" encountered an error: ${error.message}.`,
            error,
        );
    });

    lavaclient.on("nodeDebug", (node, message) => {
        client.logger.debug(`Node "${node.id}" debug: ${message}`);
    });

    lavaclient.on("nodeTrackStart", (_node, queue, song) => {
        const fields = [];

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Now Playing" })
            .setColor(client.colors.SkyBlue)
            .setDescription(`[${song.title}](${song.uri})`)
            .setFooter({ text: `Requested By: ${song.requester}` });

        if (song.sourceName === "youtube") {
            const identifier = song.identifier;
            const thumbnail = `https://img.youtube.com/vi/${identifier}/hqdefault.jpg`;
            embed.setThumbnail(thumbnail);
        }

        fields.push({
            name: "Song Duration",
            value: "`" + prettyMs(song.length, { colonNotation: true }) + "`",
            inline: true,
        });

        if (queue.tracks.length > 0) {
            fields.push({
                name: "Position in Queue",
                value: (queue.tracks.length + 1).toString(),
                inline: true,
            });
        }

        embed.setFields(fields);
        queue.data.channel.send({ embeds: [embed] });
    });

    lavaclient.on("nodeQueueFinish", async (_node, queue) => {
        const channel = client.channels.cache.get(queue.player.channelId);
        channel.safeSend("Queue has ended.");
        queue.player.disconnect();
        await client.musicManager.destroyPlayer(queue.player.guildId);
    });

    return lavaclient;
};
