//  In future this file may be replaced with a more generic handler for interaction controls
// but for now it is lavalink player controls only
const { EmbedBuilder, MessageFlags, GuildMember } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle player buttons controls
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").Message} message
 * @param {import("lavalink-client").Player} player
 * @returns {Promise<void>}
 */
async function handlePlayerControls(client, message, player) {
  const { locale } = await client.mongodb.guilds.get(message.guildId);
  const clientMember = message.guild.members.resolve(client.user);

  // message interaction collector to respond to buttons
  const collector = message.createMessageComponentCollector({
    filter: async (b) => {
      if (b.member instanceof GuildMember) {
        let isSameVoiceChannel = clientMember?.voice.channelId === b.member.voice.channelId;
        if (isSameVoiceChannel) return true;
      }
      await b.reply({
        content: t("player:notConnected", {
          lng: locale,
          channel: b.guild?.members.me?.voice.channelId ?? "None",
        }),
        flags: MessageFlags.Ephemeral,
      });
      return false;
    },
  });

  /**
   * A function to edit the buttons of the message
   * @param {boolean} clearButtons
   * @returns {Promise<void>}
   */
  async function editButtons(clearButtons) {
    let components = [...client.utils.getPlayerButtons(player)];
    if (clearButtons) components = [];
    await message.edit({ components });
  }

  collector.on("collect", async (interaction) => {
    await interaction.deferUpdate();
    const embed = new EmbedBuilder().setColor(message.embeds[0].color).setFooter({
      text: interaction.user.username,
      iconURL: interaction.user.avatarURL({ extension: "png" }),
    });

    /**
     * A function to edit the buttons of the message
     * @param {string} text
     * @returns {Promise<void>}
     */
    async function replyAndDelete(text) {
      embed.setDescription(text);
      const reply = await interaction.followUp({ embeds: [embed] });
      setTimeout(() => reply.delete(), 10_000);
    }

    switch (interaction.customId) {
      case "volume_down": {
        let { volume } = await player.setVolume(Math.max(player.volume - 10, 0));
        await editButtons();
        return await replyAndDelete(
          t("player:volumeBy", {
            lng: locale,
            volume,
            user: interaction.user.username,
          })
        );
      }

      case "volume_up": {
        let { volume } = await player.setVolume(
          Math.min(player.volume + 10, client.config.lavalink.maxVolume)
        );
        await editButtons();
        return await replyAndDelete(
          t("player:volumeBy", {
            lng: locale,
            volume,
            user: interaction.user.username,
          })
        );
      }

      case "rewind": {
        let { position } = await player.seek(player.position - 10000);
        position = client.utils.formatTime(position);
        await editButtons();
        return await replyAndDelete(
          t("player:rewoundBy", {
            lng: locale,
            position,
            user: interaction.user.username,
          })
        );
      }

      case "forward": {
        let { position } = await player.seek(player.position + 10000);
        position = client.utils.formatTime(position);
        await editButtons();
        return await replyAndDelete(
          t("player:forwardedBy", {
            lng: locale,
            position,
            user: interaction.user.username,
          })
        );
      }

      case "resume": {
        let position = client.utils.formatTime(player.position);
        if (player.paused) {
          await player.resume();
          await replyAndDelete(
            t("player:resumedBy", {
              lng: locale,
              user: interaction.user.username,
            })
          );
        } else {
          await player.pause();
          await replyAndDelete(
            t("player:pausedBy", {
              lng: locale,
              position,
              user: interaction.user.username,
            })
          );
        }
        return await editButtons();
      }

      case "stop": {
        await player.stopPlaying(true, false);
        await editButtons(true);
        return await replyAndDelete(t("player:stop", { lng: locale }));
      }

      case "previous": {
        if (!player.queue.previous) {
          return await replyAndDelete(t("player:noPrevious", { lng: locale }));
        }
        // player.position > 5000 || player.queue.previous.length <= 0
        // await player.seek(0);
        if (player.queue.previous.length <= 0) {
          return await replyAndDelete(t("player:noPrevious", { lng: locale }));
        }
        await player.play({ track: player.queue.previous[0] });
        return await replyAndDelete(
          t("player:previousBy", {
            lng: locale,
            user: interaction.user.username,
          })
        );
      }

      case "skip": {
        if (!player.queue.tracks.length > 0) {
          return await replyAndDelete(t("player:noTrack", { lng: locale }));
        }
        await player.skip();
        return await replyAndDelete(
          t("player:skippedBy", {
            lng: locale,
            user: interaction.user.username,
          })
        );
      }

      case "shuffle": {
        await player.queue.shuffle();
        return await replyAndDelete(
          t("player:shuffledBy", {
            lng: locale,
            user: interaction.user.username,
          })
        );
      }

      case "loop": {
        switch (player.repeatMode) {
          case "off": {
            await player.setRepeatMode("track");
            await editButtons();
            return await replyAndDelete(
              t("player:loopingTrackBy", {
                lng: locale,
                user: interaction.user.username,
              })
            );
          }

          case "track": {
            await player.setRepeatMode("queue");
            await editButtons();
            return await replyAndDelete(
              t("player:loopingQueueBy", {
                lng: locale,
                user: interaction.user.username,
              })
            );
          }

          case "queue": {
            await player.setRepeatMode("off");
            await editButtons();
            return await replyAndDelete(
              t("player:loopingOffBy", {
                lng: locale,
                user: interaction.user.username,
              })
            );
          }

          default: {
            return;
          }
        }
      }

      case "queue_clear": {
        await player.queue.utils.destroy();
        return await replyAndDelete("Cleared the queue!");
      }

      case "favourite": {
        return await replyAndDelete("This feature is still in development.");
      }

      default: {
        return;
      }
    }
  });
}

// case "autoplay": {
//   let autoplay = player.get("autoplay");
//   if (!autoplay) {
//     player.set("autoplay", true);
//     await editButtons();
//     return await replyAndDelete(
//       t("player:autoplayOnBy", { lng: locale, user })
//     );
//   } else {
//     player.set("autoplay", false);
//     await editButtons();
//     return await replyAndDelete(
//       t("player:autoplayOffBy", { lng: locale, user })
//     );
//   }
// }

// case "lyrics": {
//   let lyrics = "";
//   const current = player.queue.current;
//   const res = await player.getCurrentLyrics(true).catch(() => null);
//   if (!res || res.error || !res.lines) {
//     return await replyAndDelete({
//       content: t("player:noLyrics", { lng: locale }),
//       flags: MessageFlags.Ephemeral
//     });
//   }
//   res.lines.forEach((l) => (lyrics += `${l.line}\n`));
//   return await interaction.followUp({
//     content: `**${current.info.title} (${res.provider})**:\n\n${lyrics}`,
//     flags: MessageFlags.Ephemeral
//   });
// }

//	case "clear_queue":
//		player.queue.clear();
//		interaction.reply({ content: "Cleared the queue.", ephemeral: true });
//
//	case "vote_skip":
//		const vote = await initiateVoteToSkip(message, player);
//		interaction.reply({ content: `Vote result: ${vote}`, ephemeral: true });
//
//	case "seek":
//		player.seek(60000); // Seek to 1 minute
//		interaction.reply({ content: "Seeked to 1 minute.", ephemeral: true });
//
//	case "view_queue":
//		interaction.reply({
//			content: `Current queue:\n${player.queue.map((t, i) => `${i + 1}. ${t.title}`).join("\n")}`,
//			ephemeral: true,
//		});
//
//	case "song-quality":
//		const selectedQuality = interaction.values[0];
//		interaction.reply({
//			content: `Selected song quality: **${selectedQuality}**`,
//			ephemeral: true,
//		});
//
//	case "dj_mode":
//		djModeEnabled = !djModeEnabled;
//		if (!djModeData) {
//			djModeData = new DjMode({ guildId, enabled: djModeEnabled });
//		} else {
//			djModeData.enabled = djModeEnabled;
//		}
//		await djModeData.save();
//		interaction.reply({
//			content: `DJ mode has been ${djModeEnabled ? "enabled" : "disabled"}.`,
//			ephemeral: true,
//		});
//

//if (!(await checkDj(client, interaction))) {
//  await interaction.followUp({
//    content: t( "player.trackStart.need_dj_role"),
//    flags: MessageFlags.Ephemeral
//  });
//  return;
//}

module.exports = { handlePlayerControls };
