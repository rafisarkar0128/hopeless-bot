const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  name: "pause",
  description: "pause or stop the current music player",
  cooldown: 0,
  category: "MUSIC",
  isPremium: false,
  isGlobal: true,
  isGuildOnly: true,
  isDevOnly: true,
  isVoceChannelOnly: true,
  botPermissions: [],
  userPermissions: [],
  prefixCommand: {
    enabled: true,
    aliases: ["halt"],
    usage: "<options>",
    minArgsCount: 0,
    subcommands: [],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    usage: "/pause <options>",
    data: new SlashCommandBuilder()
      .setName("pause")
      .setDescription("pause or stop the current music player")
      .setContexts(InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  },
  //run: async (client, message, args) => {},
  execute: async (client, interaction) => {
    const player = client.moonlink.players.get(interaction.guild.id);

    if (!player) {
      const nEmbed = new EmbedBuilder()
        .setColor(client.colors.Wrong)
        .setTitle("**There is no music player in this server.**");
      return interaction.reply({
        embeds: [nEmbed],
      });
    }

    if (player.playing) {
      player.pause();
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.colors.Wrong)
          .setTitle("**Paused the music player. user `/resume` to resume the player**"),
      ],
    });
  },
};
