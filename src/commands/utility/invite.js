const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  resolvePartialEmoji,
  OAuth2Scopes,
  ChatInputCommandInteraction,
  Message,
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
      await sendBotInvite(client, message);
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
      await sendBotInvite(client, interaction);
    },
  },
};

/**
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @returns {Promise<void>}
 */
function sendBotInvite(client, ctx) {
  if (
    client.config.allowedInvite === false &&
    !client.config.devs.includes(ctx.user ? ctx.user.id : ctx.author.id)
  ) {
    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(t("commands:invite.reply.disabled"))
          .setColor(client.colors.Wrong),
      ],
      ephemeral: true,
    });
  }

  const inviteLink = client.generateInvite({
    permissions: BigInt(1758600129150711),
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
  });
  const button = new ButtonBuilder()
    .setLabel("Invite Link")
    .setStyle(ButtonStyle.Link)
    .setURL(inviteLink)
    .setEmoji(resolvePartialEmoji("✉️"));

  return ctx.reply({
    content: t("commands:invite.reply.content"),
    components: [new ActionRowBuilder().addComponents(button)],
  });
}
