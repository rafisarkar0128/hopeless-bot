const emojis = require("@src/resources/emojis.js");
const config = require("@src/config.js");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

/**
 * A utility class for button related utilities.
 * @abstract
 */
module.exports = class Buttons {
  /**
   * A function to generate new buttons for music player
   * @param {import("lavalink-client").Player} player The player to get buttons for.
   * @returns {import("discord.js").ActionRowBuilder[]}
   */
  getPlayer(player) {
    const { music } = emojis;

    const row1 = new ActionRowBuilder().setComponents(
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
        .setDisabled(player.volume >= config.music.maxVolume)
    );

    const row2 = new ActionRowBuilder().setComponents(
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
    );

    return [row1, row2];
  }

  /**
   * A function to get buttons for navigating between pages.
   * @param {number} currentPage the current page number
   * @param {number} totalPages total number or embeds
   * @returns {import("discord.js").ActionRowBuilder}
   */
  getPage(currentPage, totalPages) {
    const { page } = emojis;
    const firstEmbed = currentPage === 0;
    const lastEmbed = currentPage === totalPages - 1;

    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("page_first")
        .setEmoji(page.first)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(firstEmbed),

      new ButtonBuilder()
        .setCustomId("page_back")
        .setEmoji(page.back)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(firstEmbed),

      new ButtonBuilder()
        .setCustomId("page_stop")
        .setEmoji(page.cancel)
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("page_next")
        .setEmoji(page.next)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(lastEmbed),

      new ButtonBuilder()
        .setCustomId("page_last")
        .setEmoji(page.last)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(lastEmbed)
    );
  }
};
