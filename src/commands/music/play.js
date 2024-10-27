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
    disabled: true,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message, args) => {
      const query = args.join(" ");
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("play")
      .setDescription("play a song from youtube music")
      .addStringOption((option) =>
        option
          .setName("source")
          .setDescription("Select a source")
          .setRequired(true)
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
      .addStringOption((option) =>
        option.setName("query").setDescription("Song name or url").setRequired(true),
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

      const src = interaction.options.getString("source");
      const query = interaction.options.getString("query");

      if (query === "nothing_found")
        return interaction.followUp({ content: `No Tracks found`, ephemeral: true });
      if (query === "join_vc")
        return interaction.followUp({
          content: `You joined a VC, but redo the Command please.`,
          ephemeral: true,
        });

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

      const player =
        client.lavalink.getPlayer(interaction.guildId) ||
        client.lavalink.createPlayer({
          guildId: interaction.guildId,
          voiceChannelId: vc.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          selfMute: false,
          volume: 50, // default volume
          instaUpdateFiltersFix: true, // optional
          applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
          // node: "YOUR_NODE_ID",
          // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
        });

      if (!player.connected) await player.connect();

      if (player.voiceChannelId !== vc.id) {
        return interaction.followUp({
          ephemeral: true,
          content: "You need to be in my Voice Channel",
        });
      }

      const response =
        fromAutoComplete ||
        (await player.search({ query: query, source: src }, interaction.user));

      if (!response || !response.tracks?.length)
        return interaction.followUp({ content: `No Tracks found`, ephemeral: true });

      await player.queue.add(
        response.loadType === "playlist"
          ? response.tracks
          : response.tracks[
              fromAutoComplete ? Number(query.replace("autocomplete_", "")) : 0
            ],
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

      if (!player.playing) await player.play();
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
