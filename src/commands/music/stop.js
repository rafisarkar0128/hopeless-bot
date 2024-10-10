const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop the bot from playing music")
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  aliases: ["st"],
  usage: "/play < option >| {prefix}play <song-name | options>",
  cooldown: 0,
  category: "MUSIC",
  disabled: false,
  global: true,
  guildOnly: true,
  devOnly: false,
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
