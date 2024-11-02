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
    name: "resume",
    description: "resume or start the current music player",
    aliases: ["start"],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message) => {
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

      if (player.paused) {
        player.resume();
      }

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Wrong)
            .setDescription("**Started playing music again.**"),
        ],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("resume")
      .setDescription("resume or start the current music player")
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

      if (player.paused) {
        player.resume();
      }

      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(Wrong)
            .setDescription("**Started playing music again.**"),
        ],
      });
    },
  },
};
