const {
  EmbedBuilder,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const { getChannelCountString } = require("../../utils/server.utils.js");
const { DateTime } = require("luxon");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("📖 View the server information.")
    .setDMPermission(false),
  category: "server",
  usage: "/info member",
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (client, interaction) => {
    try {
      const Guild = await interaction.guild.fetch();
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
        .setColor(
          client.colors.array[
            Math.floor(Math.random() * client.colors.array.length)
          ]
        )
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
            } | Bots: ${
              Members.filter((m) => m.user.bot === true).size
            }\n\`\`\``,
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
            } | Animated: ${
              Emojis.filter((e) => e.animated === true).size
            } | Sticker: ${Stickers.size}\n\`\`\``,
            inline: false,
          },
          {
            name: "Server created on (DD/MM/YYYY)",
            value: `\`\`\`\n${DateTime.fromMillis(
              Guild.createdTimestamp
            ).toFormat("dd/LL/yy, h:mm:ss a")} (${DateTime.fromMillis(
              Guild.createdTimestamp
            ).toRelativeCalendar()})\n\`\`\``,
            inline: true,
          }
        )
        .setFooter({
          text: `Powered by ${client.user.username}`,
        });

      return interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      throw error;
    }
  },
};
