const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const ms = require("ms");

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
    name: "timeout",
    description: "⏰ Restrict a member's ability to communicate.",
    aliases: ["tmout", "time", "mute"],
    usage: "<member> <duration> (<reason>)",
    disabled: true,
    minArgsCount: 2,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("timeout")
      .setDescription("⏰ Restrict a member's ability to communicate.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("The member to timeout.")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("duration")
          .setDescription("Duration of the timeout.")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for the the timeout.")
          .setRequired(false),
      ),
    usage: "[member]: <member> [duration]: <duration> (reason): <reason>",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const member = interaction.options.getMember("member");
      const duration = interaction.options.getString("duration");
      const reason = interaction.options.getString("reason");

      const errorsArray = [];
      const errorEmbed = new EmbedBuilder()
        .setAuthor({
          name: "Could not timeout member due to",
        })
        .setColor(client.colors.americanRose);

      if (!member) {
        return interaction.followUp({
          embeds: [errorEmbed.setDescription("Member has most likely left the server.")],
          ephemeral: true,
        });
      }
      if (!ms(duration) || ms(duration) > ms("28d")) {
        errorsArray.push("The provided time is invalid or over the 28 days limit.");
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

      await member.timeout(ms(duration), reason);

      if (reason) {
        return interaction.reply({
          content: `**✅ @${member.user.username} has been timed out for ${reason}**`,
        });
      } else {
        return interaction.reply({
          content: `**✅ @${member.user.username} has been timed out!**`,
        });
      }
    },
  },
};
