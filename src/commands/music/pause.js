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
    botPermissions: [],
    userPermissions: [],
  },
  prefix: {
    name: "pause",
    description: "pause or stop the current music player",
    aliases: [],
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

      if (player.playing) {
        player.pause();
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Wrong)
            .setDescription(
              "**Paused the music player. user `/resume` to resume the player**",
            ),
        ],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("pause")
      .setDescription("pause or stop the current music player.")
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
        return interaction.reply({
          embeds: [nEmbed],
        });
      }

      if (player.playing) {
        player.pause();
      }

      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Wrong)
            .setDescription(
              "**Paused the music player. user `/resume` to resume the player**",
            ),
        ],
        ephemeral: true,
      });
    },
  },
};
