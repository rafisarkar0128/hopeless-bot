const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("playlocal")
        .setDescription(t("commands:playlocal.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addAttachmentOption((option) =>
          option
            .setName("file")
            .setDescription(t("commands:playlocal.options.file"))
            .setRequired(true)
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
        },
      },
      prefixOptions: {
        aliases: [
          "pl",
          "playfile",
          "pf",
          "play_local",
          "play_file",
          "pfile",
          "plocal",
          "playf",
          "play_loc",
        ],
        minArgsCount: 0,
      },
      details: {
        usage: "playlocal <file>",
        examples: ["playlocal <file>", "pl <file>"],
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
    const file = message.attachments.first();
    if (!file) {
      await message.reply({ content: t("player:noFile", { lng: metadata.locale }) });
      return;
    }

    const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!audioExtensions.includes(`.${extension}`)) {
      await message.reply({ content: t("player:invalidFileType", { lng: metadata.locale }) });
      return;
    }

    const player = await this.getPlayer(client, message);
    if (!player.connected) await player.connect();

    const res = await player.search({ query: file.url, source: "local" }, message.author);
    const response = await this.getResponse(player, res, metadata.locale);

    await message.reply({ content: response.message });
    if (!response.error && !player.playing && !player.paused) await player.play({ paused: false });
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

    const file = interaction.options.getAttachment("file", true);
    const playOption = interaction.options.getString("options", false) ?? undefined;

    if (!file) {
      await interaction.followUp({ content: t("player:noFile", { lng: metadata.locale }) });
      return;
    }

    const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!audioExtensions.includes(`.${extension}`)) {
      await interaction.followUp({
        content: t("player:invalidFileType", { lng: metadata.locale }),
      });
      return;
    }

    const player = await this.getPlayer(client, interaction);
    if (!player.connected) await player.connect();

    const res = await player.search({ query: file.url, source: "local" }, interaction.user);
    const response = await this.getResponse(player, res, metadata.locale, playOption);

    await interaction.followUp({ content: response.message });
    if (!response.error && !player.playing && !player.paused) await player.play({ paused: false });
  }

  /**
   * A function to get or create a lavalink player.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Message<true>|import("discord.js").ChatInputCommandInteraction} context
   * @param {import("lavalink-client").LavalinkNode[]} [nodes]
   * @returns {Promise<import("lavalink-client").Player>}
   */
  async getPlayer(client, context, nodes = []) {
    let player = client.lavalink.players.get(context.guildId);

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
   * Get response after based on the provided inputs.
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").SearchResult} response
   * @param {string} lng
   * @param {"play_next" | "play_now" | "add_to_queue"} [playOption]
   * @returns {Promise<{message: string, error?: boolean}>}
   */
  async getResponse(player, response, lng, playOption) {
    switch (response.loadType) {
      case "error": {
        return { message: t("player:loadFailed", { lng }), error: true };
      }

      case "empty": {
        return { message: t("player:emptyResult", { lng }), error: true };
      }

      case "playlist": {
        await this.loadTracks(player, response.tracks, playOption);
        return {
          message: t("player:addPlaylist", {
            lng,
            size: response.tracks.length,
            title: response.playlist?.name ? response.playlist.name : "playlist",
          }),
          error: false,
        };
      }

      case "track":
      case "search": {
        let track = response.tracks.shift();
        let position = await this.loadTracks(player, track, playOption);
        return {
          message: t("player:addTrack", {
            lng,
            position,
            track: `[${track.info.title}](<${track.info.uri}>)`,
          }),
          error: false,
        };
      }
    }
  }
};
