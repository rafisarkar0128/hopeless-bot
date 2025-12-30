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
        .setName("skip")
        .setDescription(t("commands:skip.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(t("commands:skip.options.number"))
            .setRequired(false)
            .setMinValue(1)
        ),
      options: {
        category: "music",
        cooldown: 5,
        global: true,
        guildOnly: true,
        player: {
          voice: true,
          active: true,
        },
      },
      prefixOptions: {
        aliases: ["skiptrack", "next", "sk", "nexttrack", "skipto"],
        minArgsCount: 0,
      },
      details: {
        usage: "skip [number]",
        examples: ["skip", "skip 3", "next", "sk 2"],
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
    const number = args[0] ? parseInt(args[0], 10) : null;
    const player = client.lavalink.getPlayer(message.guildId);
    const response = await this.skipAndReturnReply(player, number, metadata.locale);
    await message.reply(response);
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
    const number = interaction.options.getInteger("number");
    const player = client.lavalink.getPlayer(interaction.guildId);
    const response = await this.skipAndReturnReply(player, number, metadata.locale);
    await interaction.followUp(response);
  }

  /**
   * A common execute function for both command types.
   * @param {import("lavalink-client").Player} player
   * @param {number} number
   * @param {string} lng
   * @returns {Promise<string>}
   */
  async skipAndReturnReply(player, number, lng) {
    if (player.queue.tracks.length === 0) {
      return t("player:noTrack", { lng });
    }

    if (number == null) {
      await player.skip();
      return t("player:skipped", { lng });
    }

    if (number < 1 || number > player.queue.tracks.length) {
      return t("player:invalidTrackNumber", { lng });
    }

    await player.skip(number);
    return t("player:skippedTo", { lng, number });
  }
};
