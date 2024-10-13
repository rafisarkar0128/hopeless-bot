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

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  name: "invite",
  description: "returns a link button with bots invite url.",
  cooldown: 0,
  category: "UTILITY",
  isPremium: false,
  isGlobal: true,
  isGuildOnly: false,
  isDevOnly: false,
  isVoceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  prefixCommand: {
    enabled: true,
    aliases: ["invt"],
    usage: "",
    minArgsCount: 0,
    subcommands: [],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    usage: "/invite",
    data: new SlashCommandBuilder()
      .setName("invite")
      .setDescription("returns a link button with bots invite url."),
  },
  run: (client, message) => {
    return sendBotInvite(client, message);
  },
  execute: (client, interaction) => {
    return sendBotInvite(client, interaction);
  },
};

/**
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @returns {Promise<void>}
 */
function sendBotInvite(client, ctx) {
  if (
    client.config.bot.invite === "false" &&
    !client.config.devs.includes(ctx.user ? ctx.user.id : ctx.author.id)
  ) {
    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("**Sorry. Invites has been disabled by the owner.**")
          .setColor(client.colors.Wrong),
      ],
      ephemeral: true,
    });
  }

  const inviteLink = client.generateInvite({
    permissions: BigInt(630567770521207),
    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
  });
  const button = new ButtonBuilder()
    .setLabel("Invite Link")
    .setStyle(ButtonStyle.Link)
    .setURL(inviteLink)
    .setEmoji(resolvePartialEmoji("✉️"));

  return ctx.reply({
    content: "Invite me by clicking the button.",
    components: [new ActionRowBuilder().addComponents(button)],
  });
}
