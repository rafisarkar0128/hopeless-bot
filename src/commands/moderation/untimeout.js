const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "moderation",
    cooldown: 0,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: [
      "SendMessages",
      "ReadMessageHistory",
      "ModerateMembers",
      "ManageMessages",
    ],
    userPermissions: ["SendMessages", "ModerateMembers"],
  },
  prefix: {
    name: "untimeout",
    description: "⏰ Remove timeout from a member.",
    aliases: ["untmout", "untime", "utimeout"],
    usage: "<member> (<reason>)",
    disabled: true,
    minArgsCount: 1,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("untimeout")
      .setDescription("⏰ Remove timeout from a member.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("The member to untimeout.")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for the the untimeout.")
          .setRequired(false),
      ),
    usage: "[member]: <member> [reason]?: <reason>",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const member = interaction.options.getMember("member");
      const reason = interaction.options.getString("reason");

      const errorsArray = [];
      const errorEmbed = new EmbedBuilder()
        .setAuthor({
          name: "Could not untimeout member due to",
        })
        .setColor(client.colors.americanRose);

      if (!member) {
        return interaction.followUp({
          embeds: [errorEmbed.setDescription("Member has most likely left the server.")],
          ephemeral: true,
        });
      }

      if (!member.moderatable || !member.manageable) {
        errorsArray.push("Selected member is not moderatable by this bot.");
      }

      if (interaction.member.roles.highest.position < member.roles.highest.position) {
        errorsArray.push("Selected member has a higher role position than you.");
      }

      if (errorsArray.length) {
        return interaction.followUp({
          embeds: [errorEmbed.setDescription(errorsArray.join("\n"))],
          ephemeral: true,
        });
      }

      await member.timeout(10000, reason);
      let content;

      if (reason) {
        content = `**✅ @${member.user.username} has been untimed out for ${reason}**`;
      } else {
        content = `**✅ @${member.user.username} has been untimed out!**`;
      }

      return interaction.reply({
        content: content,
      });
    },
  },
};
