const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
} = require("discord.js");

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
    description: "play a song from youtube music",
    aliases: ["pl", "add"],
    usage: "<song|url>",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message, args) => {
      var src = "ytm";
      if (client.config.plugins.music.sources.includes(args[0].toLowerCase())) {
        src = args.shift().toLowerCase();
      }

      const query = args.join(" ");
      const vc = message.member?.voice?.channel;

      const player =
        client.lavalink.getPlayer(message.guildId) ||
        client.lavalink.createPlayer({
          guildId: message.guildId,
          voiceChannelId: vc.id,
          textChannelId: message.channelId,
          selfDeaf: true,
          selfMute: false,
          volume: 50,
          instaUpdateFiltersFix: true,
          applyVolumeAsFilter: false,
        });

      if (!player.connected) await player.connect();

      if (player.voiceChannelId !== vc.id) {
        return interaction.followUp({
          ephemeral: true,
          content: "You need to be in my Voice Channel",
        });
      }

      const response = await player.search({ query: query, source: src }, message.author);

      if (!response || !response.tracks?.length)
        return message.reply({ content: `No Tracks found` });

      await player.queue.add(
        response.loadType === "playlist" ? response.tracks : response.tracks[0],
      );

      await message.reply({
        content:
          response.loadType === "playlist"
            ? `✅ Added [${response.tracks.length}] Tracks${
                response.playlist?.title
                  ? ` - from the ${response.pluginInfo.type || "Playlist"} ${
                      response.playlist.uri
                        ? `[\`${response.playlist.title}\`](<${response.playlist.uri}>)`
                        : `\`${response.playlist.title}\``
                    }`
                  : ""
              } at \`#${player.queue.tracks.length - response.tracks.length}\``
            : `✅ Added [\`${response.tracks[0].info.title}\`](<${response.tracks[0].info.uri}>) by \`${response.tracks[0].info.author}\` at \`#${player.queue.tracks.length}\``,
      });

      if (!player.playing) await player.play();
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("play a song from youtube music")
      .addStringOption((option) =>
        option.setName("query").setDescription("Song name or url").setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("source")
          .setDescription("Select a source")
          .addChoices([
            {
              name: "Youtube",
              value: "yt",
            },
            {
              name: "YoutTube Music",
              value: "ytm",
            },
            {
              name: "Spotify",
              value: "spotify",
            },
          ]),
      )
      .setContexts(InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
    usage: "[query]: <song|url>",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const vc = interaction.member?.voice?.channel;
      const src = interaction.options.getString("source") ?? "ytm";
      const query = interaction.options.getString("query");

      const player =
        client.lavalink.getPlayer(interaction.guildId) ||
        client.lavalink.createPlayer({
          guildId: interaction.guildId,
          voiceChannelId: vc.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          selfMute: false,
          volume: 50,
          instaUpdateFiltersFix: true,
          applyVolumeAsFilter: false,
        });

      if (!player.connected) await player.connect();

      if (player.voiceChannelId !== vc.id) {
        return interaction.followUp({
          ephemeral: true,
          content: "You need to be in my Voice Channel",
        });
      }

      const response = await player.search(
        { query: query, source: src },
        interaction.user,
      );

      if (!response || !response.tracks?.length)
        return interaction.followUp({ content: `No Tracks found`, ephemeral: true });

      await player.queue.add(
        response.loadType === "playlist" ? response.tracks : response.tracks[0],
      );

      await interaction.followUp({
        content:
          response.loadType === "playlist"
            ? `✅ Added [${response.tracks.length}] Tracks${
                response.playlist?.title
                  ? ` - from the ${response.pluginInfo.type || "Playlist"} ${
                      response.playlist.uri
                        ? `[\`${response.playlist.title}\`](<${response.playlist.uri}>)`
                        : `\`${response.playlist.title}\``
                    }`
                  : ""
              } at \`#${player.queue.tracks.length - response.tracks.length}\``
            : `✅ Added [\`${response.tracks[0].info.title}\`](<${response.tracks[0].info.uri}>) by \`${response.tracks[0].info.author}\` at \`#${player.queue.tracks.length}\``,
      });

      if (!player.playing) {
        await player.play();
      }
    },
  },
};
