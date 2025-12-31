const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription(t("commands:volume.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(t("commands:volume.options.number"))
            .setMinValue(0)
            .setMaxValue(200)
            .setRequired(false)
        ),
      options: {
        category: "general",
        cooldown: 5,
        global: true,
        guildOnly: true,
        player: {
          voice: true,
          active: true,
        },
      },
      prefixOptions: {
        aliases: ["vol", "loudness", "soundlevel", "setvolume", "setvol"],
        minArgsCount: 0,
      },
      details: {
        usage: "volume <number>",
        examples: ["volume 100", "vol 50", "setvolume 150"],
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
    const number = args[0] ? parseInt(args[0], 10) : null;

    if (number === null) {
      await message.reply(
        t("player:currentVolume", { lng: metadata.locale, amount: player.volume })
      );
      return;
    }

    if (number > 200) {
      await message.reply(t("player:volumeTooHigh", { lng: metadata.locale }));
      return;
    }

    if (number < 0) {
      await message.reply(t("player:volumeTooLow", { lng: metadata.locale }));
      return;
    }

    const { volume } = await player.setVolume(number);
    await message.reply(t("player:setVolume", { lng: metadata.locale, amount: volume }));
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
    const number = interaction.options.getInteger("number", false);

    if (number === null) {
      await interaction.followUp(
        t("player:currentVolume", { lng: metadata.locale, amount: player.volume })
      );
      return;
    }

    if (number > 200) {
      await interaction.followUp(t("player:volumeTooHigh", { lng: metadata.locale }));
      return;
    }

    if (number < 0) {
      await interaction.followUp(t("player:volumeTooLow", { lng: metadata.locale }));
      return;
    }

    const { volume } = await player.setVolume(number);
    await interaction.followUp(t("player:setVolume", { lng: metadata.locale, amount: volume }));
  }
};
