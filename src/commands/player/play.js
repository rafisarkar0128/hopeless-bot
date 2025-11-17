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
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription(t("commands:play.options.options"))
            .setRequired(false)
            .addChoices([
              { name: "Play Next", value: "play_next" },
              { name: "Play Now", value: "play_now" },
              { name: "Add to Queue", value: "add_to_queue" },
            ])
        ),
      options: {
        category: "music",
        cooldown: 10,
        global: true,
        guildOnly: true,
        permissions: {
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
      prefixOptions: { aliases: ["pl", "add"], minArgsCount: 0 },
      details: {
        usage: "play <song|url>",
        examples: [
          "play example",
          "play https://www.youtube.com/watch?v=example",
          "play https://open.spotify.com/track/example",
          "play http://www.example.com/example.mp3",
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
    let reply = await message.reply(t("player:defaultReply", { lng: metadata.locale }));
    const query = args.join(" ");
    const player = await this.getPlayer(client, message);

    if (!query || query.length === 0) {
      if (player.queue.current && !player.playing) {
        await player.resume();
        reply.edit(t("player:resume", { lng: metadata.locale }));
      } else {
        reply.edit(t("player:noQuery", { lng: metadata.locale }));
      }
    } else {
      const response = await player.search({ query }, message.author);
      const responseEmbed = await this.getResponseEmbed(client, player, response, metadata);
      reply.edit({ content: "", embeds: [responseEmbed] });
      if (!player.playing && !player.paused) await player.play({ paused: false });
    }

    setTimeout(() => {
      if (message.deletable) message.delete().catch(() => null);
      reply.delete().catch(() => null);
    }, 10_000);
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

    const query = interaction.options.getString("query", true);
    const playOption = interaction.options.getString("options", false) ?? undefined;
    const playerSource = interaction.options.getString("source", false) ?? undefined;

    let source = undefined;
    let nodes = client.lavalink.nodeManager.leastUsedNodes("memory");

    if (playerSource) {
      const [sourceName, searchSource] = playerSource.split(/:/g);
      source = searchSource;
      nodes = nodes.filter((n) => n.info.sourceManagers.includes(sourceName));
      if (nodes.length === 0) {
        const embed = new EmbedBuilder()
          .setColor(client.colors.error)
          .setDescription(t("player:noSource", { lng: metadata.locale, source: sourceName }));
        await interaction.followUp({ embeds: [embed] });
        setTimeout(() => interaction.deleteReply(), 10_000);
        return;
      }
    }

    const player = await this.getPlayer(client, interaction, nodes);
    const response = await player.search({ query, source }, interaction.user);
    const responseEmbed = await this.getResponseEmbed(
      client,
      player,
      response,
      metadata,
      playOption
    );

    await interaction.followUp({ embeds: [responseEmbed] });
    setTimeout(() => interaction.deleteReply(), 10_000);

    if (!player.playing && !player.paused) await player.play({ paused: false });
  }

  /**
   * A function to get or create a lavalink player.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Message<true>|import("discord.js").ChatInputCommandInteraction} context
   * @param {import("lavalink-client").LavalinkNode[]} [nodes]
   * @returns {Promise<import("lavalink-client").Player>}
   */
  async getPlayer(client, context, nodes = []) {
    let player = client.lavalink.getPlayer(context.guildId);

    if (!nodes || nodes.length === 0) {
      nodes = client.lavalink.nodeManager.leastUsedNodes("memory");
    }

    if (!player) {
      const voiceChannel = context.member.voice?.channel;
      player = client.lavalink.createPlayer({
        guildId: context.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: context.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.config.lavalink.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
        vcRegion: voiceChannel?.rtcRegion,
        node: nodes[0],
      });
    }

    if (!player.connected) await player.connect();
    return player;
  }

  /**
   * Load tracks into the player's queue.
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track|import("lavalink-client").Track[]} tracks
   * @param {"play_next" | "play_now" | "add_to_queue"} [playOptions]
   * @returns {Promise<number>}
   */
  async loadTracks(player, tracks, playOption) {
    switch (playOption) {
      case "play_next": {
        return await player.queue.splice(0, 0, tracks);
      }

      case "play_now": {
        await player.play({ clientTrack: tracks });
        return 1;
      }

      case "add_to_queue":
      default: {
        return await player.queue.add(tracks);
      }
    }
  }

  /**
   * Get response embed after searching a query and then adding to queue.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").SearchResult} response
   * @param {import("@database/index").Structures.Guild} metadata
   * @param {"play_next" | "play_now" | "add_to_queue"} [playOption]
   * @returns {Promise<import("discord.js").EmbedBuilder>}
   */
  async getResponseEmbed(client, player, response, metadata, playOption) {
    const embed = new EmbedBuilder().setColor(client.colors.main);

    switch (response.loadType) {
      case "error": {
        embed
          .setColor(client.colors.error)
          .setDescription(t("player:loadFailed", { lng: metadata.locale }));
        return embed;
      }

      case "empty": {
        embed
          .setColor(client.colors.standby)
          .setDescription(t("player:emptyResult", { lng: metadata.locale }));
        return embed;
      }

      case "playlist": {
        await this.loadTracks(player, response.tracks, playOption);
        embed.setDescription(
          t("player:addPlaylist", {
            lng: metadata.locale,
            size: response.tracks.length,
            title: response.playlist?.name ? response.playlist.name : "playlist",
          })
        );
        return embed;
      }

      case "track":
      case "search": {
        let track = response.tracks.shift();
        let position = await this.loadTracks(player, track, playOption);
        embed.setDescription(
          t("player:addTrack", {
            lng: metadata.locale,
            position,
            track: `[${track.info.title}](<${track.info.uri}>)`,
          })
        );
        return embed;
      }
    }
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
