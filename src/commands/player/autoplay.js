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
        .setName("autoplay")
        .setDescription(t("commands:autoplay.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      options: {
        category: "music",
        cooldown: 5,
        global: true,
        guildOnly: true,
        player: { voice: true, active: true },
      },
      prefixOptions: { aliases: ["autop", "aplay", "auto"], minArgsCount: 0 },
      details: { usage: "autoplay", examples: ["autoplay"] },
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
    const response = this.toggleAutoplay(client, message.guildId, metadata?.locale);
    await message.reply({ content: response });
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
    const response = this.toggleAutoplay(client, interaction.guildId, metadata?.locale);
    await interaction.followUp({ content: response });
  }

  /**
   * Execute function for this command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {string} guildId
   * @param {string} lng
   * @returns {string}
   */
  toggleAutoplay(client, guildId, lng) {
    const player = client.lavalink.players.get(guildId);
    const autoplay = player.get("autoplay");
    player.set("autoplay", !autoplay);

    if (autoplay) {
      return t("commands:autoplay.disabled", { lng });
    } else {
      return t("commands:autoplay.enabled", { lng });
    }
  }
};
