const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  OAuth2Scopes,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("about")
        .setDescription(t("commands:about.description"))
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
        category: "information",
        cooldown: 5,
        global: true,
      },
      prefixOptions: {
        aliases: ["bio", "about", "info", "me", "whoami", "story", "intro", "hello", "identity"],
        minArgsCount: 0,
      },
      details: {
        usage: "about",
        examples: ["about"],
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
    const actionRow = this.getActionRow(client, metadata);
    const embed = this.getAboutMeEmbed(client, metadata);
    await message.reply({ embeds: [embed], components: [actionRow] });
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
    const actionRow = this.getActionRow(client, metadata);
    const embed = this.getAboutMeEmbed(client, metadata);
    await interaction.followUp({ embeds: [embed], components: [actionRow] });
  }

  /**
   * Action row generator.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {import("discord.js").ActionRowBuilder<any>} Action row with buttons.
   */
  getActionRow(client, metadata) {
    return new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel(t("misc:buttons.support", { lng: metadata.locale }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.supportServer),
      new ButtonBuilder()
        .setLabel(t("misc:buttons.website", { lng: metadata.locale }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.botWebsite),
      new ButtonBuilder()
        .setLabel(t("misc:buttons.invite", { lng: metadata.locale }))
        .setStyle(ButtonStyle.Link)
        .setURL(
          client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: client.config.bot.defaultPermissions,
          })
        ),
      new ButtonBuilder()
        .setLabel(t("misc:buttons.github", { lng: metadata.locale }))
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.githubRepo)
    );
  }

  /**
   * About me embed generator.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {import("discord.js").EmbedBuilder} About me embed.
   */
  getAboutMeEmbed(client, metadata) {
    return new EmbedBuilder()
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.avatarURL({ extension: "png" }),
      })
      .setThumbnail(client.user.avatarURL({ extension: "png" }))
      .setColor(client.colors.main)
      .addFields(
        {
          name: t("commands:about.fields.creator", { lng: metadata.locale }),
          value: "[rafisarkar0128](https://github.com/rafisarkar0128)",
          inline: true,
        },
        {
          name: t("commands:about.fields.repository", { lng: metadata.locale }),
          value: "[Here](https://github.com/rafisarkar0128/hopeless-bot)",
          inline: true,
        },
        {
          name: t("commands:about.fields.support", { lng: metadata.locale }),
          value: `[Here](${client.config.links.supportServer})`,
          inline: true,
        },
        {
          name: "\u200b",
          value: t("commands:about.fields.description", {
            lng: metadata.locale,
            username: client.user.username,
          }),
          inline: true,
        }
      );
  }
};
