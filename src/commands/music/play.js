const {
  SlashCommandBuilder,
  EmbedBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  ChatInputCommandInteraction,
  Message,
} = require("discord.js");
const autocompleteMap = new Map();

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "music",
    cooldown: 0,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: true,
    botPermissions: ["SendMessages", "Connect", "Speak", "EmbedLinks"],
    userPermissions: ["SendMessages"],
  },
  prefix: {
    name: "play",
    description: "",
    aliases: ["pl", "add"],
    usage: "<song|url>",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message, args) => {
      const query = args.join(" ");

      // Create a player.
      const player = client.riffy.createConnection({
        guildId: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        deaf: true,
      });

      const resolve = await client.riffy.resolve({
        query: query,
        requester: message.author,
      });
      const { loadType, tracks, playlistInfo } = resolve;

      /**
       * Important: If you are using Lavalink V3, here are the changes you need to make:
       *
       * 1. Replace "playlist" with "PLAYLIST_LOADED"
       * 2. Replace "search" with "SEARCH_RESULT"
       * 3. Replace "track" with "TRACK_LOADED"
       */

      if (loadType === "playlist") {
        for (const track of resolve.tracks) {
          track.info.requester = message.author;
          player.queue.add(track);
        }

        message.channel.send(
          `Added: \`${tracks.length} tracks\` from \`${playlistInfo.name}\``,
        );
        if (!player.playing && !player.paused) return player.play();
      } else if (loadType === "search" || loadType === "track") {
        const track = tracks.shift();
        track.info.requester = message.author;

        player.queue.add(track);
        message.reply(`Added: \`${track.info.title}\``);
        if (!player.playing && !player.paused) return player.play();
      } else {
        return message.channel.send("There are no results found.");
      }
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("play a song from youtube music")
      .addStringOption((option) =>
        option.setName("query").setDescription("song name or url").setRequired(true),
      )
      .setContexts(InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
    usage: "[query]: <song|url>",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      await interaction.deferReply();

      const vc = interaction.member?.voice?.channel;
      if (!vc.joinable || !vc.speakable) {
        return interaction.followUp({
          ephemeral: true,
          content: "I am not able to join your channel / speak in there.",
        });
      }

      //const src = (interaction.options).getString("source")
      const query = interaction.options.getString("query");

      const fromAutoComplete =
        Number(query.replace("autocomplete_", "")) >= 0 &&
        autocompleteMap.has(`${interaction.user.id}_res`) &&
        autocompleteMap.get(`${interaction.user.id}_res`);
      if (autocompleteMap.has(`${interaction.user.id}_res`)) {
        if (autocompleteMap.has(`${interaction.user.id}_timeout`))
          clearTimeout(autocompleteMap.get(`${interaction.user.id}_timeout`));
        autocompleteMap.delete(`${interaction.user.id}_res`);
        autocompleteMap.delete(`${interaction.user.id}_timeout`);
      }

      const player = client.riffy.createConnection({
        guildId: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channel.id,
        deaf: true,
      });

      const resolve = await client.riffy.resolve({
        query: query,
        requester: interaction.user,
      });
      const { loadType, tracks, playlistInfo } = resolve;

      /**
       * Important: If you are using Lavalink V3, here are the changes you need to make:
       *
       * 1. Replace "playlist" with "PLAYLIST_LOADED"
       * 2. Replace "search" with "SEARCH_RESULT"
       * 3. Replace "track" with "TRACK_LOADED"
       */

      if (loadType === "playlist") {
        for (const track of resolve.tracks) {
          track.info.requester = message.author;
          player.queue.add(track);
        }

        interaction.channel.send(
          `Added: \`${tracks.length} tracks\` from \`${playlistInfo.name}\``,
        );
        if (!player.playing && !player.paused) return player.play();
      } else if (loadType === "search" || loadType === "track") {
        const track = tracks.shift();
        track.info.requester = interaction.user;

        player.queue.add(track);
        interaction.followUp(`Added: \`${track.info.title}\``);
        if (!player.playing && !player.paused) return player.play();
      } else {
        return interaction.followUp("There are no results found.");
      }
    },
    autocomplete: async (client, interaction) => {
      if (!interaction.guildId) return;
      const vcId = interaction.member?.voice?.channelId;
      if (!vcId)
        return interaction.respond([{ name: `Join a voice Channel`, value: "join_vc" }]);

      const focussedQuery = interaction.options.getFocused();
      const player =
        client.lavalink.getPlayer(interaction.guildId) ||
        (await client.lavalink.createPlayer({
          guildId: interaction.guildId,
          voiceChannelId: vcId,
          textChannelId: interaction.channelId, // in what guild + channel(s)
          selfDeaf: true,
          selfMute: false,
          volume: client.defaultVolume,
          instaUpdateFiltersFix: true, // configuration(s)
        }));

      if (!player.connected) await player.connect();

      if (player.voiceChannelId !== vcId)
        return interaction.respond([
          { name: `You need to be in my Voice Channel`, value: "join_vc" },
        ]);

      if (!focussedQuery.trim().length)
        return await interaction.respond([
          { name: `No Tracks found (enter a query)`, value: "nothing_found" },
        ]);

      const res = await player.search(
        { query: focussedQuery, source: interaction.options.getString("source") },
        interaction.user,
      );

      if (!res.tracks.length)
        return await interaction.respond([
          { name: `No Tracks found`, value: "nothing_found" },
        ]);
      // handle the res
      if (autocompleteMap.has(`${interaction.user.id}_timeout`))
        clearTimeout(autocompleteMap.get(`${interaction.user.id}_timeout`));
      autocompleteMap.set(`${interaction.user.id}_res`, res);
      autocompleteMap.set(
        `${interaction.user.id}_timeout`,
        setTimeout(() => {
          autocompleteMap.delete(`${interaction.user.id}_res`);
          autocompleteMap.delete(`${interaction.user.id}_timeout`);
        }, 25000),
      );
      await interaction.respond(
        res.loadType === "playlist"
          ? [
              {
                name: `Playlist [${res.tracks.length} Tracks] - ${res.playlist?.title}`,
                value: `autocomplete_0`,
              },
            ]
          : res.tracks
              .map((t, i) => ({
                name: `[${formatMS_HHMMSS(t.info.duration)}] ${t.info.title} (by ${
                  t.info.author || "Unknown-Author"
                })`.substring(0, 100),
                value: `autocomplete_${i}`,
              }))
              .slice(0, 25),
      );
    },
  },
};

/**
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @param {String} query
 * @returns {Promise<any>}
 */
async function play(client, ctx, query) {
  const { member, guild, channel } = ctx;
  const user = ctx.user ? ctx.user : ctx.author;

  const player = client.moonlink.createPlayer({
    guildId: guild.id,
    voiceChannelId: member.voice.channel.id,
    textChannelId: channel.id,
    autoPlay: true,
  });

  const res = await client.moonlink.search({
    query,
    source: "youtubemusic",
    requester: user.id,
  });

  if (res.loadType === "loadfailed") {
    // Responding with an error message if loading fails
    return channel.send({
      content: `:x: Load failed - the system is not cooperating.`,
    });
  } else if (res.loadType === "empty") {
    // Responding with a message if the search returns no results
    return channel.send({
      content: `:x: No matches found!`,
    });
  }

  if (res.loadType === "playlist") {
    channel.send({
      content: `${res.playlistInfo.name} This playlist has been added to the waiting list`,
    });

    for (const track of res.tracks) {
      // Adding tracks to the queue if it's a playlist
      player.queue.add(track);
    }
  } else {
    player.queue.add(res.tracks[0]);
    channel.send({
      content: `${res.tracks[0].title} was added to the waiting list`,
    });
  }

  if (!player.connected) {
    player.connect({
      setDeaf: true,
      setMute: false,
    });
  }

  if (!player.playing) {
    player.play();
  }
}

/*
//const prettyMs = require("pretty-ms");
const { EMBED_COLORS, MUSIC } = require("@root/config");
const { SpotifyItemType } = require("@lavaclient/spotify");

const search_prefix = {
    YT: "ytsearch",
    YTM: "ytmsearch",
    SC: "scsearch",
};

async function messageRun(message, args) {
    const query = args.join(" ");
    const response = await play(message, query);
    await message.safeReply(response);
}

async function interactionRun(interaction) {
    const query = interaction.options.getString("query");
    const response = await play(interaction, query);
    await interaction.followUp(response);
}

/**
 * @param {import("discord.js").CommandInteraction|import("discord.js").Message} arg0
 * @param {string} query
/
async function play({ member, guild, channel }, query) {
    if (!member.voice.channel) return "🚫 You need to join a voice channel first";

    let player = guild.client.musicManager.getPlayer(guild.id);
    if (player && !guild.members.me.voice.channel) {
        player.disconnect();
        await guild.client.musicManager.destroyPlayer(guild.id);
    }

    if (player && member.voice.channel !== guild.members.me.voice.channel) {
        return "🚫 You must be in the same voice channel as mine";
    }

    let embed = new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED);
    let tracks;
    let description = "";

    try {
        if (guild.client.musicManager.spotify.isSpotifyUrl(query)) {
            if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
                return "🚫 Spotify songs cannot be played. Please contact the bot owner";
            }

            const item = await guild.client.musicManager.spotify.load(query);
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

            if (!tracks) guild.client.logger.debug({ query, item });
        } else {
            const res = await guild.client.musicManager.rest.loadTracks(
                /^https?:\/\//.test(query)
                    ? query
                    : `${search_prefix[MUSIC.DEFAULT_SOURCE]}:${query}`,
            );
            switch (res.loadType) {
                case "LOAD_FAILED":
                    guild.client.logger.error("Search Exception", res.exception);
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

            if (!tracks) guild.client.logger.debug({ query, res });
        }
    } catch (error) {
        guild.client.logger.error("Search Exception", error);
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
        player = guild.client.musicManager.createPlayer(guild.id);
        player.queue.data.channel = channel;
        player.connect(member.voice.channel.id, { deafened: true });
    }

    // do queue things
    const started = player.playing || player.paused;
    player.queue.add(tracks, { requester: member.user.tag, next: false });
    if (!started) {
        await player.queue.start();
    }

    return { embeds: [embed] };
}
*/
