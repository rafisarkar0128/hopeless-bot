const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription(t("commands:ping.description"))
        .setContexts(
          InteractionContextType.Guild,
          InteractionContextType.BotDM,
          InteractionContextType.PrivateChannel
        )
        .setIntegrationTypes(
          ApplicationIntegrationType.GuildInstall,
          ApplicationIntegrationType.UserInstall
        ),
      options: {
        category: "utility",
        cooldown: 5,
        global: true,
      },
      prefixOptions: { aliases: ["latency"], minArgsCount: 0 },
      slashOptions: { ephemeral: false },
      details: { usage: "", examples: ["{prefix}ping", "/ping"] },
    });
  }

  /**
   * Execute function for this prefix command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ChatInputCommandInteraction} message
   * @param {string[]} args
   * @param {{lng: string}} metadata
   * @returns {Promise<void>}
   */
  async executePrefix(client, message, args, metadata) {
    const reply = await message.reply(t("commands:ping.pinging", { lng: metadata.lng }));
    const responseTime = reply.createdTimestamp - message.createdTimestamp;
    const embed = await this.getPingEmbed(client, responseTime, metadata.lng);
    await reply.edit({ content: "", embeds: [embed] });
  }

  /**
   * Execute function for this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {{lng: string}} metadata
   * @returns {Promise<void>}
   */
  async executeSlash(client, interaction, metadata) {
    const reply = await interaction.deferReply({ withResponse: true });
    const responseTime = reply.resource.message.createdTimestamp - interaction.createdTimestamp;
    const embed = await this.getPingEmbed(client, responseTime, metadata.lng);
    await interaction.followUp({ embeds: [embed] });
  }

  /**
   * A function to create the ping embed.
   * @param {import("@structures/BotClient.js")} client
   * @param {number} response
   * @param {string} lng
   * @returns {Promise<EmbedBuilder>}
   */
  async getPingEmbed(client, response, lng) {
    // The stats for the embed
    const gateway = client.ws.ping;
    const days = Math.floor(client.uptime / 86400000);
    const hours = Math.floor(client.uptime / 3600000) % 24;
    const minutes = Math.floor(client.uptime / 60000) % 60;
    const seconds = Math.floor(client.uptime / 1000) % 60;

    // The ping embed.
    const embed = new EmbedBuilder().setColor(client.color.Transparent).addFields([
      {
        name: t("commands:ping.gatewayPing", { lng }),
        value: `\`\`\`yml\n${
          gateway <= 200 ? "🟢"
          : gateway <= 400 ? "🟡"
          : "🔴"
        } ${gateway}ms\`\`\``,
        inline: true,
      },
      {
        name: t("commands:ping.responseTime", { lng }),
        value: `\`\`\`yml\n${
          response <= 200 ? "🟢"
          : response <= 400 ? "🟡"
          : "🔴"
        } ${response}ms\`\`\``,
        inline: true,
      },
      {
        name: t("commands:ping.uptime", { lng }),
        value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\n\`\`\``,
        inline: false,
      },
    ]);

    return embed;
  }
};
