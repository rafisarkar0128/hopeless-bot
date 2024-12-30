const {
  EmbedBuilder,
  SlashCommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  Message,
  Embed,
} = require("discord.js");
const { DateTime } = require("luxon");
const { t } = require("i18next");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "information",
    cooldown: 15,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: [],
    userPermissions: [],
  },
  prefix: {
    name: "serverinfo",
    description: "📖 View the server information.",
    aliases: ["server"],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message) => {
      const embed = await getGuildEmbed(client, message);
      message.reply({
        embeds: [embed],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("serverinfo")
      .setDescription("📖 View the server information."),
    usage: "",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      await interaction.deferReply();
      const embed = await getGuildEmbed(client, interaction);
      interaction.followUp({
        embeds: [embed],
      });
    },
  },
};

/** Function to get guild embed
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @returns {Promise<Embed>}
 */
async function getGuildEmbed(client, ctx) {
  const Guild = await ctx.guild.fetch();
  const Owner = await Guild.fetchOwner();
  const Members = await Guild.members.fetch();
  const Roles = Guild.roles.cache;
  const Channels = Guild.channels.cache;
  const Iconurl = Guild.iconURL();
  const Bannerurl = Guild.bannerURL();
  const Emojis = Guild.emojis.cache;
  const Stickers = Guild.stickers.cache;

  const embed = new EmbedBuilder()
    .setTitle("📝 Server Information")
    .setColor(client.utils.getRandomColor())
    .setThumbnail(Iconurl)
    .setImage(Bannerurl)
    .addFields(
      {
        name: "Server Name",
        value: `\`\`\`\n${Guild.name}\n\`\`\``,
        inline: true,
      },
      {
        name: "Server ID",
        value: `\`\`\`\n${Guild.id}\n\`\`\``,
        inline: true,
      },
      {
        name: `Members [${Members.size}]`,
        value: `\`\`\`\nMembers: ${
          Members.filter((m) => m.user.bot === false).size
        } | Bots: ${Members.filter((m) => m.user.bot === true).size}\n\`\`\``,
        inline: false,
      },
      {
        name: "Server Owner",
        value: `<@${Owner.user.id}>`,
        inline: true,
      },
      {
        name: "Owner ID",
        value: `\`\`\`\n${Owner.id}\n\`\`\``,
        inline: true,
      },
      {
        name: `Server Categories and Channels [${Channels.size}]`,
        value: `\`\`\`\n${await getChannelCountString(Channels)}\n\`\`\``,
        inline: false,
      },
      {
        name: "Server Boosts",
        value: `\`\`\`\n${Guild.premiumSubscriptionCount} Boosts\n\`\`\``,
        inline: true,
      },
      {
        name: "Server Boost Level",
        value: `\`\`\`\nlevel: ${Guild.premiumTier}\n\`\`\``,
        inline: true,
      },
      {
        name: `Server Roles [${Roles.size}] (Shows up to 20)`,
        value: `${Roles.sort((a, b) => {
          b.position - a.position;
        })
          .map((r) => r)
          .slice(0, 20)
          .join(" ")}`,
        inline: false,
      },
      {
        name: `Server Emojis and Stickers [${Emojis.size + Stickers.size}]`,
        value: `\`\`\`\nNormal: ${
          Emojis.filter((e) => e.animated === false).size
        } | Animated: ${Emojis.filter((e) => e.animated === true).size} | Sticker: ${
          Stickers.size
        }\n\`\`\``,
        inline: false,
      },
      {
        name: "Server created on (DD/MM/YYYY)",
        value: `\`\`\`\n${DateTime.fromMillis(Guild.createdTimestamp).toFormat(
          "dd/LL/yy, h:mm:ss a",
        )} (${DateTime.fromMillis(Guild.createdTimestamp).toRelativeCalendar()})\n\`\`\``,
        inline: true,
      },
    )
    .setFooter({
      text: t("default:embed.footer", {
        username: client.user.username,
        year: new Date().getFullYear(),
      }),
    });

  return embed;
}

/** Function to get guild channels info string
 * @param {import("discord.js").Channel[]} Channels
 * @returns {string}
 */
async function getChannelCountString(Channels) {
  const ChannelString = `Categories: ${
    Channels.filter((c) => c.type === ChannelType.GuildCategory).size
  } | Text: ${Channels.filter((c) => c.type === ChannelType.GuildText).size} | Voice: ${
    Channels.filter((c) => c.type === ChannelType.GuildVoice).size
  } | Announcement: ${
    Channels.filter((c) => c.type === ChannelType.GuildAnnouncement).size
  } | Stage: ${
    Channels.filter((c) => c.type === ChannelType.GuildStageVoice).size
  } | Forum: ${Channels.filter((c) => c.type === ChannelType.GuildForum).size} | Media: ${
    Channels.filter((c) => c.type === ChannelType.GuildMedia).size
  } | Directory: ${Channels.filter((c) => c.type === ChannelType.GuildDirectory).size}`;

  return ChannelString;
}
