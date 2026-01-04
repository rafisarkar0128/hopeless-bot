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
        .setName("seek")
        .setDescription(t("commands:seek.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(t("commands:seek.options.duration"))
            .setRequired(true)
        ),
      options: {
        category: "music",
        cooldown: 5,
        global: true,
        guildOnly: true,
        player: {
          voice: true,
          active: true,
          playing: true,
        },
      },
      prefixOptions: {
        aliases: ["seekto", "forwardto", "forward", "rewindto"],
        minArgsCount: 1,
      },
      details: {
        usage: "seek <duration>",
        examples: ["seek 1m", "seek 1h 30m", "seek 1h 30m 30s"],
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
    const player = client.lavalink.players.get(message.guildId);
    const duration = client.utils.parseTime(args.join(" "));
    const responseMessage = await this.seekAndGetResponse(
      client,
      player,
      duration,
      metadata.locale
    );

    await message.reply({ content: responseMessage });
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

    const player = client.lavalink.players.get(interaction.guildId);
    const duration = client.utils.parseTime(interaction.options.getString("duration", true));
    const responseMessage = await this.seekAndGetResponse(
      client,
      player,
      duration,
      metadata.locale
    );

    await interaction.followUp({ content: responseMessage });
  }

  /**
   * A helper function to seek and get response message.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("@lib/lavalink/Player")} player
   * @param {number} duration
   * @param {string} lng
   */
  async seekAndGetResponse(client, player, duration, lng) {
    const track = player.queue.current;

    if (typeof duration !== "number" || isNaN(duration) || duration < 0) {
      return t("player:invalidSeekFormat", { lng });
    }

    if (!track.info.isSeekable || track.info.isStream) {
      return t("player:unseekableTrack", { lng });
    }

    if (duration > track.info.duration) {
      return t("player:beyondDuration", {
        lng,
        duration: `\`${client.utils.formatTime(track.info.duration, "clock")}\``,
      });
    }

    await player.seek(duration);
    return t("player:seekedTo", {
      lng,
      duration: `\`${client.utils.formatTime(duration, "clock")}\``,
    });
  }
};
