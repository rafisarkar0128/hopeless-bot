const { EmbedBuilder, SlashCommandBuilder, Embed, Guild, Role } = require("discord.js");
const { DateTime } = require("luxon");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "information",
    cooldown: 15,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: ["SendMessages", "ReadMessageHistory"],
    userPermissions: ["SendMessages"],
  },
  prefix: {
    name: "roleinfo",
    description: "📖 View any role's information.",
    aliases: ["rlinfo", "rinfo", "roleif"],
    usage: "",
    disabled: true,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("roleinfo")
      .setDescription("📖 View any role's information.")
      .addRoleOption((option) =>
        option.setName("role").setDescription("Select a role.").setRequired(true),
      ),
    usage: "[role]: <role>",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const roleId = interaction.options.getRole("role").id;
      const role = (await interaction.guild.roles.fetch()).get(roleId);
      const embed = await getRoleEmbed(client, interaction, role);

      return interaction.reply({
        embeds: [embed],
      });
    },
  },
};

/** Fucntion to get Role Embed
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {Guild} guild
 * @param {Role} role
 * @return {Promise<Embed>}
 */
async function getRoleEmbed(client, guild, role) {
  const embed = new EmbedBuilder()
    .setTitle("ROLE INFORMATION")
    .setColor(role.hexColor)
    .setThumbnail(role.icon ? role.iconURL() : null)
    .addFields(
      {
        name: "Name",
        value: `\`\`\`\n${role.name}\`\`\``,
        inline: true,
      },
      {
        name: "ID",
        value: `\`\`\`\n${role.id}\`\`\``,
        inline: true,
      },
      {
        name: `Position (from top)`,
        value: `\`\`\`m\n${guild.roles.cache.size - role.position}\`\`\``,
        inline: true,
      },
      {
        name: "Color Code",
        value: `\`\`\`\n${role.hexColor}\`\`\``,
        inline: true,
      },
      {
        name: "Mentionable",
        value: `\`\`\`\n${role.mentionable ? "Yes" : "No"}\n\`\`\``,
        inline: true,
      },
      {
        name: "Hoisted",
        value: `\`\`\`\n${role.hoist ? "Yes" : "No"}\n\`\`\``,
        inline: true,
      },
      {
        name: "Bot Role",
        value: `\`\`\`\n${role.managed ? "Yes" : "No"}\n\`\`\``,
        inline: true,
      },
      {
        name: "Created On",
        value: `\`\`\`\n${DateTime.fromMillis(role.createdTimestamp).toFormat(
          "dd/LL/yy, h:mm:ss a",
        )} (${DateTime.fromMillis(role.createdTimestamp).toRelativeCalendar()})\n\`\`\``,
        inline: false,
      },
    )
    .setFooter({
      text: client.config.bot.footer,
    });

  return embed;
}
