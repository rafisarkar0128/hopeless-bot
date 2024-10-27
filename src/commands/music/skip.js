const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Message,
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
      return skipSong(client, message);
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
      return skipSong(client, interaction);
    },
  },
};

/**
 * types for parameters
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @returns {void}
 */
function skipSong(client, ctx) {
  const player = client.riffy.players.get(ctx.guild.id);
  if (!player) {
    return ctx.reply({
      content: "**Couldn't find any player for this guild**",
      ephemeral: true,
    });
  }

  if (!player.playing && player.queue.length === 0) {
    return ctx.reply({
      content: "**There is no music playing right now**",
    });
  }

  player.stop();
  return ctx.reply({
    content: "**skipped the current song.**",
    ephemeral: true,
  });
}
