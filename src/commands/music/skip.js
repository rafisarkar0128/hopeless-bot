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
    botPermissions: ["SendMessages", "Connect", "Speak", "ReadMessageHistory"],
    userPermissions: ["SendMessages", "Connect"],
  },
  prefix: {
    name: "skip",
    description: "skip the now playing song from the queue",
    aliases: ["next", "sk"],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message) => {
      const player = client.lavalink.players.get(message.guild.id);
      if (!player) {
        message.reply({
          content: "**Couldn't find any player for this guild**",
          ephemeral: true,
        });
        return;
      }

      if (!player.playing && player.queue.length === 0) {
        message.reply({
          content: "**There is no music playing right now**",
        });
        return;
      }

      if (player.queue.tracks.length <= 0) {
        message.reply({
          content: "There are no songs in the queue.",
        });
        return;
      }

      player.skip();
      message.reply({
        content: "**skipped the current song.**",
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("skip")
      .setDescription("skip the now playing song from the queue"),
    usage: "",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const player = client.lavalink.players.get(interaction.guild.id);
      if (!player) {
        interaction.followUp({
          content: "**Couldn't find any player for this guild**",
          ephemeral: true,
        });
        return;
      }

      if (!player.playing && player.queue.length === 0) {
        interaction.followUp({
          content: "**There is no music playing right now**",
        });
        return;
      }

      if (player.queue.tracks.length <= 0) {
        interaction.followUp({
          content: "There are no songs in the queue.",
        });
        return;
      }

      player.skip();
      interaction.followUp({
        content: "**skipped the current song.**",
        ephemeral: true,
      });
    },
  },
};
