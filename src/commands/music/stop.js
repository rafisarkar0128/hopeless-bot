const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "music",
    cooldown: 0,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: true,
    botPermissions: ["SendMessages", "ReadMessageHistory"],
    userPermissions: ["SendMessages"],
  },
  prefix: {
    name: "stop",
    description: "stop the bot from playing music",
    aliases: ["st"],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message) => {
      const { Wrong } = client.config.colors;

      const player = client.lavalink.players.get(message.guild.id);
      if (!player) {
        const nEmbed = new EmbedBuilder()
          .setColor(Wrong)
          .setDescription("**There is no music player in this server.**");
        return message.reply({
          embeds: [nEmbed],
        });
      }

      if (player.connected) {
        player.destroy("Command Issued", true);
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Wrong)
            .setDescription(
              "**Destroyed the music player and disconnected from the voice channel.**",
            ),
        ],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("stop")
      .setDescription("stop the bot from playing music")
      .setContexts(InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
    usage: "",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const { Wrong } = client.config.colors;

      const player = client.lavalink.players.get(interaction.guild.id);
      if (!player) {
        const nEmbed = new EmbedBuilder()
          .setColor(Wrong)
          .setDescription("**There is no music player in this server.**");
        return interaction.followUp({
          embeds: [nEmbed],
        });
      }

      if (player.connected) {
        player.destroy("Command Issued", true);
      }

      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Wrong)
            .setDescription(
              "**Destroyed the music player and disconnected from the voice channel.**",
            ),
        ],
      });
    },
  },
};
