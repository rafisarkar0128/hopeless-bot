const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  name: "stop",
  description: "stop the bot from playing music",
  cooldown: 0,
  category: "MUSIC",
  isPremium: false,
  isGlobal: true,
  isGuildOnly: true,
  isDevOnly: false,
  isVCOnly: true,
  botPermissions: [],
  userPermissions: [],
  prefixCommand: {
    enabled: true,
    aliases: ["st"],
    usage: "<options>",
    minArgsCount: 0,
    subcommands: [],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    usage: "/stop <option>",
    data: new SlashCommandBuilder()
      .setName("stop")
      .setDescription("stop the bot from playing music")
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

    if (player.connected) {
      player.stop();
      player.disconnect();
      player.destroy();
    }

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.colors.Wrong)
          .setTitle(
            "**Stopped the music player and disconnected from the voice channel.**",
          ),
      ],
    });
  },
};
