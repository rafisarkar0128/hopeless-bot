const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const search_prefix = {
    YT: "ytsearch",
    YTM: "ytmsearch",
    SC: "scsearch",
};

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song from youtube")
        .addStringOption((option) =>
            option.setName("query").setDescription("song name or url").setRequired(true),
        ),
    aliases: ["pl"],
    minArgsCount: 0,
    usage: "/play < option >| {prefix}play <song-name | options>",
    cooldown: 0,
    category: "MUSIC",
    premium: false,
    disabled: { slash: false, prefix: true },
    global: false,
    guildOnly: true,
    devOnly: true,
    botPermissions: ["EmbedLinks"],
    userPermissions: [],
    run: async (client, message, args, data) => { },
    execute: async (client, interaction, data) => {
        if (!interaction.member.voice.channel) {
            // Responding with a message if the user is not in a voice channel
            return interaction.reply({
                content: `You are not in a voice channel`,
                ephemeral: true,
            });
        }

        let query = interaction.options.getString("query");
        let player = client.moonlink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            autoPlay: true,
        });

        if (!player.connected) {
            // Connecting to the voice channel if not already connected
            player.connect({
                setDeaf: true,
                setMute: false,
            });
        }

        let res = await client.moonlink.search({
            query,
            source: "youtube",
            requester: interaction.user.id,
        });

        if (res.loadType === "loadfailed") {
            // Responding with an error message if loading fails
            return interaction.reply({
                content: `:x: Load failed - the system is not cooperating.`,
            });
        } else if (res.loadType === "empty") {
            // Responding with a message if the search returns no results
            return interaction.reply({
                content: `:x: No matches found!`,
            });
        }

        if (res.loadType === "playlist") {
            interaction.reply({
                content: `${res.playlistInfo.name} This playlist has been added to the waiting list, spreading joy`,
            });

            for (const track of res.tracks) {
                // Adding tracks to the queue if it's a playlist
                player.queue.add(track);
            }
        } else {
            player.queue.add(res.tracks[0]);
            interaction.reply({
                content: `${res.tracks[0].title} was added to the waiting list`,
            });
        }

        if (!player.playing) {
            // Starting playback if not already playing
            player.play();
        }
    },
};

/*
const { colors, config } = client;
const { user, guild, channel, options, member } = interaction;
const query = options.getString("query");
const errEmbed = new EmbedBuilder().setColor(colors.Wrong);

if (!member.voice.channel) {
    return interaction.reply({
        embeds: [errEmbed.setDescription("🚫 You need to join a voice channel first")],
        ephemeral: true,
    });
}

const player = client.lavalink.getPlayer(guild.id);
if (player && !guild.members.me.voice.channel) {
    player.voice.disconnect();
    await client.lavalink.players.destroy(guild.id, true);
}

if (player && member.voice.channel !== guild.members.me.voice.channel) {
    return interaction.reply({
        content: "🚫 You must be in the same voice channel as mine",
        ephemeral: true,
    });
}

const embed = new EmbedBuilder().setColor(colors.DeepSkyBlue);
var tracks;
var description = "";

try {
    if (client.lavalink.spotify.isSpotifyUrl(query)) {
        if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
            return await channel.send(
                "🚫 Spotify songs cannot be played. Please contact the bot owner",
            );
        }

        const item = await guild.client.lavalink.spotify.load(query);
        switch (item?.type) {
            case SpotifyItemType.Track: {
                const track = await item.resolveYoutubeTrack();
                tracks = [track];
                description = `[${track.info.title}](${track.info.uri})`;
                break;
            }

            case SpotifyItemType.Artist:
                tracks = await item.resolveYoutubeTracks();
                description = `Artist: [**${item.name}**](${query})`;
                break;

            case SpotifyItemType.Album:
                tracks = await item.resolveYoutubeTracks();
                description = `Album: [**${item.name}**](${query})`;
                break;

            case SpotifyItemType.Playlist:
                tracks = await item.resolveYoutubeTracks();
                description = `Playlist: [**${item.name}**](${query})`;
                break;

            default:
                return "🚫 An error occurred while searching for the song";
        }

        if (!tracks) client.logger.debug({ query, item });
    } else {
        const res = await client.lavalink.api.loadTracks(
            /^https?:\/\//.test(query)
                ? query
                : `${search_prefix[music.default_source]}:${query}`,
        );
        switch (res.loadType) {
            case "LOAD_FAILED":
                client.logger.error("Search Exception", res.exception);
                return "🚫 There was an error while searching";

            case "NO_MATCHES":
                return `No results found matching ${query}`;

            case "PLAYLIST_LOADED":
                tracks = res.tracks;
                description = res.playlistInfo.name;
                break;

            case "TRACK_LOADED":
            case "SEARCH_RESULT": {
                const [track] = res.tracks;
                tracks = [track];
                break;
            }

            default:
                guild.client.logger.debug("Unknown loadType", res);
                return "🚫 An error occurred while searching for the song";
        }

        if (!tracks) client.logger.debug({ query, res });
    }
} catch (error) {
    client.logger.error("Search Exception", error);
    return "🚫 An error occurred while searching for the song";
}

if (!tracks) return "🚫 An error occurred while searching for the song";

if (tracks.length === 1) {
    const track = tracks[0];
    if (!player?.playing && !player?.paused && !player?.queue.tracks.length) {
        embed.setAuthor({ name: "Added Track to queue" });
    } else {
        const fields = [];
        embed
            .setAuthor({ name: "Added Track to queue" })
            .setDescription(`[${track.info.title}](${track.info.uri})`)
            .setFooter({ text: `Requested By: ${member.user.tag}` });

        fields.push({
            name: "Song Duration",
            value: "`" + prettyMs(track.info.length, { colonNotation: true }) + "`",
            inline: true,
        });

        if (player?.queue?.tracks?.length > 0) {
            fields.push({
                name: "Position in Queue",
                value: (player.queue.tracks.length + 1).toString(),
                inline: true,
            });
        }
        embed.addFields(fields);
    }
} else {
    embed
        .setAuthor({ name: "Added Playlist to queue" })
        .setDescription(description)
        .addFields(
            {
                name: "Enqueued",
                value: `${tracks.length} songs`,
                inline: true,
            },
            {
                name: "Playlist duration",
                value:
                    "`" +
                    prettyMs(
                        tracks.map((t) => t.info.length).reduce((a, b) => a + b, 0),
                        { colonNotation: true },
                    ) +
                    "`",
                inline: true,
            },
        )
        .setFooter({ text: `Requested By: ${member.user.tag}` });
}

// create a player and/or join the member's vc
if (!player?.connected) {
    player = client.lavalink.players.create(guild.id);
    player.queue.data.channel = channel;
    player.connect(member.voice.channel.id, { deafened: true });
}

// do queue things
const started = player.playing || player.paused;
player.queue.add(tracks, { requester: member.user.tag, next: false });
if (!started) {
    await player.queue.start();
}

return await interaction.followUp({ embeds: [embed] });
*/
