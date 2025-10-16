const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(t("commands:play.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option.setName("query").setDescription(t("commands:play.options.query")).setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("source")
            .setDescription(t("commands:search.options.source"))
            .setRequired(false)
            .addChoices([
              {
                name: "Apple Music",
                value: "applemusic:amsearch",
              },
              {
                name: "Bandcamp",
                value: "bandcamp:bcsearch",
              },
              {
                name: "Dezeer",
                value: "dezeer:dzsearch",
              },
              {
                name: "JioSaavn",
                value: "jiosaavn:jssearch",
              },
              {
                name: "Sound Cloud",
                value: "soundcloud:scsearch",
              },
              {
                name: "Spotify",
                value: "spotify:spsearch",
              },
              {
                name: "Yandex Music",
                value: "yandexmusic:ymsearch",
              },
              {
                name: "YouTube",
                value: "youtube:ytsearch",
              },
              {
                name: "YouTube Music",
                value: "youtube:ytmsearch",
              },
              {
                name: "VK Music",
                value: "vkmusic:vksearch",
              },
              {
                name: "Tidal",
                value: "tidal:tdsearch",
              },
              {
                name: "Qobuz",
                value: "qobuz:qbsearch",
              },
            ])
        )
        .addBooleanOption((option) =>
          option
            .setName("play_next")
            .setDescription(t("commands:play.options.play_next"))
            .setRequired(false)
        ),
      options: {
        category: "music",
        cooldown: 10,
        global: true,
        guildOnly: true,
        testOnly: true,
        permissions: {
          dev: true,
          bot: ["Connect", "Speak"],
          user: ["SendMessages", "Connect"],
        },
        player: {
          voice: true,
          dj: false,
          active: false,
          djPerm: null,
        },
      },
      prefixOptions: { disabled: true, aliases: ["pl"], minArgsCount: 0 },
      details: {
        usage: "play <song|url>",
        examples: [
          "{prefix}play example",
          "{prefix}play https://www.youtube.com/watch?v=example",
          "{prefix}play https://open.spotify.com/track/example",
          "{prefix}play http://www.example.com/example.mp3",
        ],
      },
    });
  }

  /**
   * Execute function for this prefix command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async executePrefix(client, message, args, metadata) {
    await message.reply("This command is in development.");
  }

  /**
   * Execute function for this slash command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async executeSlash(client, interaction, metadata) {
    await interaction.deferReply();

    const { options, channelId, guildId } = interaction;
    let player = client.lavalink.getPlayer(guildId);
    const embed = new EmbedBuilder();
    const query = options.getString("query", true);
    const playNext = options.getBoolean("play_next", false);
    const vc = interaction.member.voice?.channel;

    const src = interaction.options.getString("source", false) ?? undefined;
    let source = undefined;
    let nodes = client.lavalink.nodeManager.leastUsedNodes();

    if (src) {
      const [sourceName, searchSource] = src.split(/:/g);
      source = searchSource;
      nodes = nodes.filter((n) => n.info.sourceManagers.includes(sourceName));
      if (nodes.length <= 0) {
        embed.setDescription(t("player:noSource", { lng: metadata.locale, source: sourceName }));
        return await interaction.followUp({ embeds: [embed] });
      }
    }

    if (!player) {
      player = client.lavalink.createPlayer({
        guildId: guildId,
        voiceChannelId: vc.id,
        textChannelId: channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.config.lavalink.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
        vcRegion: vc?.rtcRegion,
        node: nodes[Math.floor(Math.random() * nodes.length)],
      });
    }
    if (!player.connected) await player.connect();

    const res = await player.search({ query, source }, interaction.user);

    if (!res || res.loadType === "error") {
      embed
        .setColor(client.colors.error)
        .setDescription(t("player:loadFailed", { lng: metadata.locale }));
      await interaction.followUp({ embeds: [embed] });
      return setTimeout(() => interaction.deleteReply(), 10_000);
    }

    if (!res.tracks?.length || res.loadType === "empty") {
      embed
        .setColor(client.colors.standby)
        .setDescription(t("player:emptyResult", { lng: metadata.locale }));
      await interaction.followUp({ embeds: [embed] });
      return setTimeout(() => interaction.deleteReply(), 10_000);
    }

    if (res.loadType === "playlist") {
      if (playNext) {
        await player.queue.splice(0, 0, res.tracks);
      } else {
        await player.queue.add(res.tracks);
      }

      embed.setColor(client.colors.main).setDescription(
        t("player:addPlaylist", {
          lng: metadata.locale,
          size: res.tracks.length,
          title: res.playlist?.name ? res.playlist.name : "playlist",
        })
      );
      await interaction.followUp({ embeds: [embed] });
    } else {
      let track = res.tracks.shift();
      let position = 0;

      if (playNext) {
        position = await player.queue.splice(0, 0, track);
      } else {
        position = await player.queue.add(track);
      }

      embed.setColor(client.colors.main).setDescription(
        t("player:addTrack", {
          lng: metadata.locale,
          position,
          track: `[${track.info.title}](<${track.info.uri}>)`,
        })
      );
      await interaction.followUp({ embeds: [embed] });
    }

    if (!player.playing) await player.play({ paused: false });
  }

  /**
   * Autocomplete function for autocomplete options of this command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").AutocompleteInteraction} interaction
   * @returns {Promise<void>}
   */
  async autocomplete(client, interaction) {
    const focused = interaction.options.getFocused();
    if (!focused || focused.length === 0) return;
    const choices = [
      {
        name: focused,
        value: "focused",
      },
    ];
    return await interaction.respond(choices);
  }
};
