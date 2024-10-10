const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Get the role list of a server."),
  aliases: [],
  usage: "/roles | {prefix}roles",
  cooldown: 15,
  category: "INFORMATION",
  disabled: false,
  global: true,
  guildOnly: true,
  devOnly: false,
  inVoiceChannel: false,
  botPermissions: [],
  userPermissions: [],
  run: async (client, message, args) => {
    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => `<@&${r.id}>`);
    const embed = new EmbedBuilder().setColor(client.utils.getRandomColor());
    const roleEmbeds = [];

    if (roles.slice(0, 50)?.length) {
      embed.setDescription(`${roles.slice(0, 50).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(50, 100).length) {
      embed.setDescription(`${roles.slice(50, 100).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(100, 150).length) {
      embed.setDescription(`${roles.slice(100, 150).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(150, 200).length) {
      embed.setDescription(`${roles.slice(150, 200).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(200, 250).length) {
      embed.setDescription(`${roles.slice(200, 250).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }

    return message.reply({
      embeds: roleEmbeds,
    });
  },
  execute: async (client, interaction) => {
    await interaction.deferReply();

    const roles = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((r) => `<@&${r.id}>`);
    const embed = new EmbedBuilder().setColor(client.utils.getRandomColor());
    const roleEmbeds = [];

    if (roles.slice(0, 50)?.length) {
      embed.setDescription(`${roles.slice(0, 50).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(50, 100).length) {
      embed.setDescription(`${roles.slice(50, 100).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(100, 150).length) {
      embed.setDescription(`${roles.slice(100, 150).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(150, 200).length) {
      embed.setDescription(`${roles.slice(150, 200).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }
    if (roles.slice(200, 250).length) {
      embed.setDescription(`${roles.slice(200, 250).join("\n")}`);
      roleEmbeds.push(embed.toJSON());
    }

    return interaction.followUp({
      embeds: roleEmbeds,
    });
  },
};
