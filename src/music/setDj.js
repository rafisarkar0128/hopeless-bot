const { EmbedBuilder } = require("discord.js");
const DjRole = require("../../schemas/djRole"); // Schema for DJ role management

module.exports = {
  name: "djrole",
  description: "Manage the DJ role for the server.",
  async execute(message, args) {
    const guildId = message.guild.id;

    // Only allow users with manage roles permission to set the DJ role
    if (!message.member.permissions.has("MANAGE_ROLES")) {
      return message.reply("You do not have permission to set the DJ role.");
    }

    const roleName = args.join(" ");
    if (!roleName) {
      return message.reply("Please provide the name of the DJ role.");
    }

    const role = message.guild.roles.cache.find((r) => r.name === roleName);
    if (!role) {
      return message.reply(`Role "${roleName}" not found. Please provide a valid role.`);
    }

    // Save DJ role in the database
    let djRoleData = await DjRole.findOne({ guildId });
    if (!djRoleData) {
      djRoleData = new DjRole({ guildId, roleId: role.id });
    } else {
      djRoleData.roleId = role.id;
    }

    await djRoleData.save();

    const embed = new EmbedBuilder()
      .setTitle("DJ Role Updated")
      .setDescription(`The DJ role has been set to: ${roleName}`)
      .setColor(0x1d82b6);

    message.channel.send({ embeds: [embed] });
  },
};
