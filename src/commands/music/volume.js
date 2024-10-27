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
      const volume = Math.floor(args[0]);
      if (typeof volume !== "number") {
        return message.reply({
          content: "**Please provide a valid value between 1 - 100 to change the volume.",
        });
      }
      return setVolume(client, message, volume);
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
    usage: "[value]: <number>",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const volume = interaction.options.getInteger("volume", true);
      return setVolume(client, interaction, volume);
    },
  },
};

/**
 * types for parameters
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @param {number} volume
 * @returns {void}
 */
function setVolume(client, ctx, volume) {
  if (!volume) {
    return ctx.reply({
      content: "**Please provide a value between 1 and 100 to change the volume.**",
      ephemeral: true,
    });
  }

  const player = client.riffy.players.get(ctx.guild.id);
  if (!player) {
    return ctx.reply({
      content: "**Couldn't find any player for this guild**",
      ephemeral: true,
    });
  }

  if (1 > volume || volume > 100) {
    return ctx.reply({
      content: "**please! provide a volume value between 1 to 100.**",
      ephemeral: true,
    });
  }

  player.setVolume(volume);
  return ctx.reply({
    content: `🔉 volume set to **${volume}**`,
    ephemeral: true,
  });
}
