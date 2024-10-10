const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("pause or stop music now playing music")
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  aliases: ["pus"],
  usage: "/pause < option >| {prefix}pause < options>",
  cooldown: 0,
  category: "MUSIC",
  disabled: false,
  global: false,
  guildOnly: true,
  devOnly: true,
  inVoiceChannel: true,
  botPermissions: ["SendMessages", "SendMessagesInThreads"],
  userPermissions: [],
  //run: async (client, message, args) => {},
  execute: async (client, interaction) => {
    const player = await client.moonlink.players.get(interaction.guild.id);

    if (!player) {
      const nEmbed = new EmbedBuilder()
        .setColor(client.colors.Wrong)
        .setTitle("**There is no music player in this server.**");
      return interaction.reply({
        embeds: [nEmbed],
      });
    }

    if (player.connected) {
      player.stop();
      player.disconnect();
      player.destroy();
    }

    const embed = new EmbedBuilder()
      .setColor(client.colors.Wrong)
      .setTitle("**Stopped the music player and disconnected from the voice channel.**");
    return interaction.reply({
      embeds: [embed],
    });
  },
};
