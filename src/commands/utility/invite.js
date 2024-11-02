const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  OAuth2Scopes,
  EmbedBuilder,
} = require("discord.js");
const { t } = require("i18next");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "utility",
    cooldown: 0,
    premium: false,
    guildOnly: false,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: ["SendMessages", "SendMessagesInThreads"],
    userPermissions: ["SendMessages", "SendMessagesInThreads"],
  },
  prefix: {
    name: "invite",
    description: "returns a link button with bots invite url.",
    aliases: [],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message) => {
      const { allowedInvite, devs, colors } = client.config;
      if (allowedInvite === false && !devs.includes(message.author.id)) {
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(t("commands:invite.reply.disabled"))
              .setColor(colors.Wrong),
          ],
          ephemeral: true,
        });
        return;
      }

      const actionRow = new ActionRowBuilder().addComponents(getInviteButton(client));
      message.reply({
        content: t("commands:invite.reply.content"),
        components: [actionRow],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("invite")
      .setDescription("returns a link button with bots invite url."),
    usage: "",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const { allowedInvite, devs, colors } = client.config;
      if (allowedInvite === false && !devs.includes(interaction.user.id)) {
        interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setTitle(t("commands:invite.reply.disabled"))
              .setColor(colors.Wrong),
          ],
          ephemeral: true,
        });
        return;
      }

      const actionRow = new ActionRowBuilder().addComponents(getInviteButton(client));
      interaction.followUp({
        content: t("commands:invite.reply.content"),
        components: [actionRow],
      });
    },
  },
};

/**
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @returns {ButtonBuilder}
 */
function getInviteButton(client) {
  const inviteLink = client.generateInvite({
    permissions: BigInt(1758600129150711),
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
  });
  const button = new ButtonBuilder()
    .setLabel("Invite Link")
    .setStyle(ButtonStyle.Link)
    .setURL(inviteLink)
    .setEmoji("✉️");

  return button;
}
