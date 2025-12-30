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
        .setName("leave")
        .setDescription(t("commands:leave.description"))
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
        },
      },
      prefixOptions: {
        aliases: ["disconct", "disconnect", "leavevc", "dissapear"],
        minArgsCount: 0,
      },
      details: {
        usage: "leave",
        examples: ["leave", "disconnect", "disconct", "leavevc", "dissapear"],
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
    const player = client.lavalink.getPlayer(message.guildId);
    const channelId = player.voiceChannelId;
    await player.destroy("Comamnd issued", true);
    await message.reply(t("player:leftChannel", { lng: metadata.locale, channelId }));
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
    const player = client.lavalink.getPlayer(interaction.guildId);
    const channelId = player.voiceChannelId;
    await player.destroy("Comamnd issued", true);
    await interaction.followUp(t("player:leftChannel", { lng: metadata.locale, channelId }));
  }
};
