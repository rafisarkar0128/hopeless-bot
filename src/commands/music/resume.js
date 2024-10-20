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
    aliases: ["play", "start"],
    usage: "",
    disabled: true,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message, args, data) => {},
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
      const player = client.moonlink.players.get(interaction.guild.id);

      if (!player) {
        const nEmbed = new EmbedBuilder()
          .setColor(client.colors.Wrong)
          .setTitle("**There is no music player in this server.**");
        return interaction.reply({
          embeds: [nEmbed],
        });
      }

      if (player.paused) {
        player.resume();
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.colors.Wrong)
            .setTitle("**Started playing music again.**"),
        ],
      });
    },
  },
};
