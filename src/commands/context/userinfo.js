const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  InteractionContextType,
  AttachmentBuilder,
} = require("discord.js");
const { profileImage } = require("discord-arts");
const { DateTime } = require("luxon");

/** @type {import("@types/commands").ContextMenuStructure} */
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("User Information")
    .setType(ApplicationCommandType.User)
    .setContexts([InteractionContextType.Guild]),
  category: "INFORMATION",
  ephemeral: true,
  cooldown: 15,
  isDisabled: false,
  isPremium: false,
  isGlobal: true,
  isGuildOnly: true,
  isDevOnly: true,
  isVoiceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  execute: async (client, interaction) => {
    const member = await interaction.guild.members.fetch(interaction.targetId);

    const profileBuffer = await profileImage(member.id);
    const imageAttachment = new AttachmentBuilder(profileBuffer, {
      name: "profile.png",
    });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${member.user.username}`,
        iconURL: `${member.user.displayAvatarURL({ size: 2048 })}`,
      })
      .setThumbnail(member.displayAvatarURL({ size: 4096 }))
      .setImage("attachment://profile.png")
      .addFields(
        {
          name: "**General Information**",
          value: [
            `**name** : ${member.user.username}`,
            `**id** : \`${member.id}\``,
            `**nickname** : ${member.displayName || None}`,
            `**bot?** : ${member.user.bot ? "Yes" : "No"} `,
            `**joined** : on ${DateTime.fromMillis(member.joinedTimestamp).toFormat(
              "FFF",
            )}`,
            `** - ${DateTime.fromMillis(member.joinedTimestamp).toRelative({})}**`,
            `**created** : on ${DateTime.fromMillis(
              member.user.createdTimestamp,
            ).toFormat("FFF")}`,
            `** - ${DateTime.fromMillis(member.user.createdTimestamp).toRelative()}**`,
          ].join("\n"),
        },
        {
          name: `Role Information`,
          value: [
            `**Roles** : Total - ${member.roles.cache.size - 1}`,
            `${member.roles.cache.map((r) => `<@&${r.id}>`).join(", ")}`,
          ].join("\n"),
        },
      )
      .setColor(member.roles.color.hexColor || client.utils.getRandomColor());

    interaction.followUp({
      embeds: [embed],
      files: [imageAttachment],
    });
  },
};
