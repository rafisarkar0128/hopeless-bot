const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

/**
 * A function to generate new buttons for the music player
 * @param {import("@lib/index").DiscordClient} client - The base Discord Client.
 * @param {import("lavalink-client").Player} player - The player to get buttons for.
 * @returns {import("discord.js").ActionRowBuilder[]}
 */
function getPlayerButtons(client, player) {
  const { music } = client.resources.emojis;
  const { lavalink } = client.config;

  return [
    new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("volume_down")
        .setEmoji(music.volumeDown)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(player.volume <= 0),
      new ButtonBuilder()
        .setCustomId("rewind")
        .setEmoji(music.rewind)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("resume")
        .setEmoji(player.paused ? music.resume : music.pause)
        .setStyle(player.paused ? ButtonStyle.Success : ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("forward")
        .setEmoji(music.forward)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("volume_up")
        .setEmoji(music.volumeUp)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(player.volume >= lavalink.maxVolume)
    ),
    new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("loop")
        .setEmoji(player.repeatMode === "track" ? music.loop2 : music.loop)
        .setStyle(player.repeatMode !== "off" ? ButtonStyle.Primary : ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji(music.previous)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("stop").setEmoji(music.stop).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("skip").setEmoji(music.next).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setEmoji(music.shuffle)
        .setStyle(ButtonStyle.Secondary)
    ),
  ];
}

module.exports = { getPlayerButtons };
