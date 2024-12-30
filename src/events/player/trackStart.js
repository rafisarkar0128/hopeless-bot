const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  Message,
  Embed,
} = require("discord.js");

//import { trackStart } from '../../utils/SetupSystem';

/** @type {import("@structures/event.d.ts").EventStructure} */
module.exports = {
  name: "trackStart",
  once: false,
  player: true,
  /**
   * types for parameters
   * @param {import("lavalink-client").Player} player
   * @param {import("lavalink-client").Track} track
   * @param {import("lavalink-client").TrackStartEvent} payload
   */
  execute: async (client, player, track, payload) => {
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;

    if (!player.textChannelId) return;
    if (!track) return;

    /** @type {import("discord.js").GuildTextBasedChannel} */
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;

    const embed = createEmbed(client, player, track);
    const message = await channel.send({
      embeds: [embed],
      components: [createButtonRow(client, player)],
    });

    createCollector(client, message, player, track, embed);

    //this.client.utils.updateStatus(this.client, guild.id);

    //const locale = await this.client.db.getLanguage(guild.id);

    //const setup = await this.client.db.getSetup(guild.id);
    //
    //if (setup?.textId) {
    //	const textChannel = guild.channels.cache.get(setup.textId)
    //	if (textChannel) {
    //		await trackStart(setup.messageId, textChannel, player, track, this.client, locale);
    //	}
    //} else {
    //	const message = await channel.send({
    //		embeds: [embed],
    //		components: [createButtonRow(player, this.client)],
    //	});
    //
    //	player.set('messageId', message.id);
    //}
  },
};

/**
 * A function to both create and update the old music embed
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {import("lavalink-client").Player} player
 * @param {import("lavalink-client").Track} track
 * @returns {Embed}
 */
function createEmbed(client, player, track) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Now Playing",
      iconURL:
        client.config.icons[track.info.sourceName] ??
        client.user?.displayAvatarURL({ extension: "png" }),
    })
    .setColor(client.config.colors.Good)
    .setDescription(`**[${track.info.title}](${track.info.uri})**`)
    .setFooter({
      text: `Requested by ${track.requester.username}`,
      iconURL: track.requester.avatarURL,
    })
    .setThumbnail(track.info.artworkUrl)
    .addFields(
      {
        name: "Duration",
        value: track.info.isStream
          ? "LIVE"
          : client.lavalink.formatTime(track.info.duration),
        inline: true,
      },
      {
        name: "Author",
        value: track.info.author,
        inline: true,
      },
    )
    .setTimestamp();

  return embed;
}

/**
 * A funtion to create buttons for the player
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {import("lavalink-client").Player} player
 * @returns
 */
function createButtonRow(client, player) {
  const previousButton = new ButtonBuilder()
    .setCustomId("previous")
    .setEmoji(client.config.emojis.music.previous)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(!player.queue.previous);

  const resumeButton = new ButtonBuilder()
    .setCustomId("resume")
    .setEmoji(
      player.paused
        ? client.config.emojis.music.resume
        : client.config.emojis.music.pause,
    )
    .setStyle(player.paused ? ButtonStyle.Success : ButtonStyle.Secondary);

  const stopButton = new ButtonBuilder()
    .setCustomId("stop")
    .setEmoji(client.config.emojis.music.stop)
    .setStyle(ButtonStyle.Danger);

  const skipButton = new ButtonBuilder()
    .setCustomId("skip")
    .setEmoji(client.config.emojis.music.next)
    .setStyle(ButtonStyle.Secondary);

  const loopButton = new ButtonBuilder()
    .setCustomId("loop")
    .setEmoji(
      player.repeatMode === "track"
        ? client.config.emojis.music.loop2
        : client.config.emojis.music.loop,
    )
    .setStyle(player.repeatMode !== "off" ? ButtonStyle.Success : ButtonStyle.Secondary);

  return new ActionRowBuilder().addComponents(
    resumeButton,
    previousButton,
    stopButton,
    skipButton,
    loopButton,
  );
}

/**
 * A function to create a message componnent collector for music buttons
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @param {Message} message
 * @param {import("lavalink-client").Player} player
 * @param {import("lavalink-client").Track} track
 * @param {EmbedBuilder} embed
 * @returns {void}
 */
function createCollector(client, message, player, track, embed) {
  const collector = message.createMessageComponentCollector({
    filter: async (b) => {
      if (b.member instanceof GuildMember) {
        const isSameVoiceChannel =
          b.guild?.members.me?.voice.channelId === b.member.voice.channelId;
        if (isSameVoiceChannel) return true;
      }
      await b.reply({
        content: `You are not connected to <#${
          b.guild?.members.me?.voice.channelId ?? "None"
        }> to use these buttons.`,
        ephemeral: true,
      });
      return false;
    },
  });

  collector.on("collect", async (interaction) => {
    //if (!(await checkDj(client, interaction))) {
    //  await interaction.reply({
    //    content: T(locale, "player.trackStart.need_dj_role"),
    //    ephemeral: true,
    //  });
    //  return;
    //}

    const editMessage = async (text) => {
      if (message) {
        await message.edit({
          embeds: [
            embed.setFooter({
              text,
              iconURL: interaction.user.avatarURL({}),
            }),
          ],
          components: [createButtonRow(client, player)],
        });
      }
    };

    switch (interaction.customId) {
      case "previous":
        {
          if (player.queue.previous) {
            await interaction.deferUpdate();
            const previousTrack = player.queue.previous[0];
            player.play({
              track: previousTrack,
            });
            await editMessage(`Previous by ${interaction.user.tag}`);
          } else {
            await interaction.reply({
              content: "There is no previous song.",
              ephemeral: true,
            });
          }
        }
        break;
      case "resume":
        {
          if (player.paused) {
            player.resume();
            await interaction.deferUpdate();
            await editMessage(`Resumed by ${interaction.user.tag}`);
          } else {
            player.pause();
            await interaction.deferUpdate();
            await editMessage(`Paused by ${interaction.user.tag}`);
          }
        }
        break;
      case "stop": {
        player.stopPlaying(true, false);
        await interaction.deferUpdate();
        break;
      }
      case "skip":
        {
          if (player.queue.tracks.length > 0) {
            await interaction.deferUpdate();
            player.skip();
            await editMessage(`Skipped by ${interaction.user.tag}`);
          } else {
            await interaction.reply({
              content: "There is no more song in the queue.",
              ephemeral: true,
            });
          }
        }
        break;
      case "loop": {
        await interaction.deferUpdate();
        switch (player.repeatMode) {
          case "off": {
            player.setRepeatMode("track");
            await editMessage(`Looping by ${interaction.user.tag}`);
            break;
          }
          case "track": {
            player.setRepeatMode("queue");
            await editMessage(`Looping Queue by ${interaction.user.tag}`);
            break;
          }
          case "queue": {
            player.setRepeatMode("off");
            await editMessage(`Looping Off by ${interaction.user.tag}`);
            break;
          }
        }
        break;
      }
    }
  });
}

/*
    "requested_by": "Requested by {user}",
    "duration": "Duration",
    "author": "Author",
    "need_dj_role": "You need to have the DJ role to use this command.",
		*/

/*
export async function checkDj(
	client: Lavamusic,
	interaction:
		| ButtonInteraction<'cached'>
		| StringSelectMenuInteraction<'cached'>
		| UserSelectMenuInteraction<'cached'>
		| RoleSelectMenuInteraction<'cached'>
		| MentionableSelectMenuInteraction<'cached'>
		| ChannelSelectMenuInteraction<'cached'>,
): Promise<boolean> {
	const dj = await client.db.getDj(interaction.guildId);
	if (dj?.mode) {
		const djRole = await client.db.getRoles(interaction.guildId);
		if (!djRole) return false;
		const hasDjRole = interaction.member.roles.cache.some(role => djRole.map(r => r.roleId).includes(role.id));
		if (!(hasDjRole || interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))) {
			return false;
		}
	}
	return true;
}

*/
