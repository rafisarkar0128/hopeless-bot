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
      const player = client.riffy.get(message.guild.id);

      if (!player) {
        const nEmbed = new EmbedBuilder()
          .setColor(client.colors.Wrong)
          .setDescription("**There is no music player in this server.**");
        return message.reply({
          embeds: [nEmbed],
        });
      }

      if (player.connected) {
        player.destroy();
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.colors.Wrong)
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
      const player = client.riffy.get(interaction.guild.id);

      if (!player) {
        const nEmbed = new EmbedBuilder()
          .setColor(client.colors.Wrong)
          .setDescription("**There is no music player in this server.**");
        return interaction.reply({
          embeds: [nEmbed],
        });
      }

      if (player.connected) {
        player.destroy();
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.colors.Wrong)
            .setDescription(
              "**Destroyed the music player and disconnected from the voice channel.**",
            ),
        ],
      });
    },
  },
};
