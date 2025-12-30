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
        .setName("join")
        .setDescription(t("commands:join.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      options: {
        category: "music",
        cooldown: 5,
        global: true,
        guildOnly: true,
        player: {
          voice: true,
        },
      },
      prefixOptions: {
        aliases: ["connect", "summon", "jn", "conct"],
        minArgsCount: 0,
      },
      details: {
        usage: "join",
        examples: ["join", "summon", "connect", "jn", "conct"],
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
    let player = client.lavalink.getPlayer(message.guildId);
    if (player) {
      await message.reply(
        t("player:alreadyConnected", {
          lng: metadata.locale,
          channelId: player.voiceChannelId,
        })
      );
      return;
    }

    if (!player) {
      const voiceChannel = message.member.voice.channel;
      player = client.lavalink.createPlayer({
        guildId: message.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: message.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.config.lavalink.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
        vcRegion: voiceChannel?.rtcRegion,
      });
    }

    if (!player.connected) await player.connect();
    await message.reply(
      t("player:joinedChannel", { lng: metadata.locale, channel: player.voiceChannelId })
    );
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
    let player = client.lavalink.getPlayer(interaction.guildId);
    if (player) {
      await interaction.followUp(
        t("player:alreadyConnected", {
          lng: metadata.locale,
          channelId: player.voiceChannelId,
        })
      );
      return;
    }

    if (!player) {
      const voiceChannel = interaction.member.voice.channel;
      player = client.lavalink.createPlayer({
        guildId: interaction.guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.config.lavalink.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false,
        vcRegion: voiceChannel?.rtcRegion,
      });
    }

    if (!player.connected) await player.connect();
    await interaction.followUp(
      t("player:joinedChannel", { lng: metadata.locale, channel: player.voiceChannelId })
    );
  }
};
