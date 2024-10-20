const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Message,
} = require("discord.js");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "information",
    cooldown: 20,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: ["SendMessages", "ReadMessageHistory"],
    userPermissions: ["SendMessages"],
  },
  prefix: {
    name: "roles",
    description: "Get the role list of a server.",
    aliases: ["rls"],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message) => {
      const roleEmbeds = getRoleEmbeds(client, message);
      return message.reply({
        embeds: roleEmbeds,
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("roles")
      .setDescription("Get the role list of a server."),
    usage: "",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      await interaction.deferReply();
      const roleEmbeds = getRoleEmbeds(client, interaction);
      interaction.followUp({
        embeds: roleEmbeds,
      });
    },
  },
};

/**
 * A function get guild role embeds
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @returns {Array}
 */
function getRoleEmbeds(client, ctx) {
  const roles = ctx.guild.roles.cache
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

  return roleEmbeds;
}
