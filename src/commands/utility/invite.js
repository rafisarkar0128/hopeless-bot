const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  OAuth2Scopes,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription(t("commmands:invite.description"))
        .setContexts(
          InteractionContextType.Guild,
          InteractionContextType.BotDM,
          InteractionContextType.PrivateChannel
        )
        .setIntegrationTypes(
          ApplicationIntegrationType.GuildInstall,
          ApplicationIntegrationType.UserInstall
        ),
      options: { category: "utility", cooldown: 5, global: true },
      prefixOptions: { aliases: ["invitation"], minArgsCount: 0 },
      details: { usage: "invite", examples: ["invite"] },
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
    const { allowedInvite, devs, defaultPermissions } = client.config.bot;
    if (!allowedInvite && !devs.includes(message.author.id)) {
      const reply = await message.reply({
        content: t("commands:invite.disabled", { lng: metadata.locale }),
      });
      setTimeout(() => {
        if (message.deleted) message.delete().catch(() => {});
        reply.delete().catch(() => {});
      }, 10_000);
      return;
    }

    const inviteButton = new ButtonBuilder()
      .setLabel("Invite Link")
      .setStyle(ButtonStyle.Link)
      .setURL(
        client.generateInvite({
          scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
          permissions: defaultPermissions,
        })
      )
      .setEmoji("✉️");

    await message.reply({
      content: t("commands:invite.reply", { lng: metadata.locale }),
      components: [new ActionRowBuilder().addComponents(inviteButton)],
    });
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

    const { allowedInvite, devs, defaultPermissions } = client.config.bot;
    if (!allowedInvite && !devs.includes(interaction.user.id)) {
      await interaction.reply({
        content: t("commands:invite.disabled", { lng: metadata.locale }),
        flags: "Ephemeral",
      });
      return;
    }

    const inviteButton = new ButtonBuilder()
      .setLabel("Invite Link")
      .setStyle(ButtonStyle.Link)
      .setURL(
        client.generateInvite({
          scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
          permissions: defaultPermissions,
        })
      )
      .setEmoji("✉️");

    await interaction.followUp({
      content: t("commands:invite.reply", { lng: metadata.locale }),
      components: [new ActionRowBuilder().addComponents(inviteButton)],
    });
  }
};
