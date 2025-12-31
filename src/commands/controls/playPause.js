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
        .setName("playpause")
        .setDescription(t("commands:playpause.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
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
        aliases: ["pause", "resume", "pp"],
        minArgsCount: 0,
      },
      details: {
        usage: "playpause",
        examples: ["playpause"],
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
    const response = await message.reply({
      content: t("player:default.response", { lng: metadata.locale }),
    });
    const player = client.lavalink.players.get(message.guildId);

    if (!player.paused && player.playing) {
      await player.pause();
      await response.edit({ content: t("player:paused", { lng: metadata.locale }) });
    } else {
      await player.resume();
      await response.edit({ content: t("player:resumed", { lng: metadata.locale }) });
    }
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

    if (!player.paused && player.playing) {
      await player.pause();
      await interaction.followUp({ content: t("player:paused", { lng: metadata.locale }) });
    } else {
      await player.resume();
      await interaction.followUp({ content: t("player:resumed", { lng: metadata.locale }) });
    }
  }
};
