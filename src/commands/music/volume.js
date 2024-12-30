const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "music",
    cooldown: 0,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: true,
    botPermissions: ["SendMessages", "ReadMessageHistory", "Connect", "Speak"],
    userPermissions: ["SendMessages", "Connect"],
  },
  prefix: {
    name: "volume",
    description: "Change the music player volume",
    aliases: ["vl"],
    usage: "<number>",
    disabled: false,
    minArgsCount: 1,
    subcommands: [],
    execute: async (client, message, args) => {
      const volume = Math.floor(args.shift());
      if (typeof volume !== "number") {
        return message.reply({
          content: "**Please provide a valid value between 1 - 100 to change the volume.",
        });
      }

      const player = client.lavalink.players.get(message.guild.id);
      if (!player) {
        return message.reply({
          content: "**Couldn't find any player for this guild**",
        });
      }

      if (1 > volume || volume > 100) {
        return message.reply({
          content: "**please! provide a volume value between 1 to 100.**",
        });
      }

      player.setVolume(volume);
      return message.reply({
        content: `🔉 volume set to **${volume}**`,
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("volume")
      .setDescription("Change the music player volume")
      .addIntegerOption((option) =>
        option
          .setName("volume")
          .setDescription("The volume to set. between 1-100")
          .setMinValue(1)
          .setMaxValue(100)
          .setRequired(true),
      ),
    usage: "[volume]: <number>",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const volume = interaction.options.getInteger("volume", true);
      const player = client.lavalink.players.get(interaction.guild.id);
      if (!player) {
        return interaction.followUp({
          content: "**Couldn't find any player for this guild**",
          ephemeral: true,
        });
      }

      if (1 > volume || volume > 100) {
        return interaction.followUp({
          content: "**please! provide a volume value between 1 to 100.**",
          ephemeral: true,
        });
      }

      player.setVolume(volume);
      return interaction.followUp({
        content: `🔉 volume set to **${volume}**`,
        ephemeral: true,
      });
    },
  },
};
