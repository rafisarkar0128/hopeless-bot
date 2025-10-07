const { ChannelType, EmbedBuilder } = require("discord.js");
const { t } = require("i18next");
const { getCooldown } = require("@utils/index");

/**
 * A function to handle slash commands
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
 * @returns {Promise<void>}
 */
async function handleSlash(client, interaction) {
  const { commandName, user } = interaction;
  const errorEmbed = new EmbedBuilder().setColor(client.color.Wrong);

  let metadata = await client.mongodb.guilds.get(interaction.guildId);
  if (!metadata) {
    metadata = await client.mongodb.guilds.create(interaction.guildId);
  }

  /**
   * A function to send reply to interactions uppon error.
   * @param {string} text - The text to send
   * @returns {Promise<void>}
   */
  async function errorReply(text) {
    errorEmbed.setDescription(text);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ embeds: [errorEmbed], flags: "Ephemeral" });
      if (!interaction.ephemeral) {
        setTimeout(() => interaction.deleteReply().catch(() => {}), 10_000);
      }
    } else {
      await interaction.reply({ embeds: [errorEmbed], flags: "Ephemeral" });
    }
  }

  const { locale } = metadata;
  const devUser = client.config.bot.devs?.includes(user.id);
  const command = client.commands.get(commandName);
  if (!command) {
    await errorReply(t("handlers:command.notFound", { lng: locale, command: commandName }));
    return await interaction.command.delete();
  }

  const { options, slashOptions } = command;
  if (slashOptions.disabled && !devUser) {
    return await errorReply(t("handlers:command.disabled", { lng: locale, command: commandName }));
  }

  if (options.guildOnly && !interaction.inGuild()) {
    return await errorReply(t("handlers:command.guildOnly", { lng: locale, command: commandName }));
  }

  if (options.permissions?.dev && !devUser) {
    return await errorReply(t("handlers:command.devOnly", { lng: locale, command: commandName }));
  }

  if (interaction.inGuild()) {
    const clientMember = interaction.guild.members.resolve(client.user);

    const missingBotPermissions = options.permissions.bot.filter(
      (p) => !clientMember.permissions.has(p)
    );
    if (missingBotPermissions.length > 0) {
      return await errorReply(
        t("handlers:command.botPerm", {
          lng: locale,
          command: commandName,
          perms: missingBotPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
    }

    const missingUserPermissions = options.permissions.user.filter(
      (p) => !interaction.member.permissions.has(p)
    );
    if (missingUserPermissions.length > 0) {
      return await errorReply(
        t("handlers:command.userPerm", {
          lng: locale,
          command: commandName,
          perms: missingUserPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
    }

    if (options.player?.voice) {
      const vc = interaction.member.voice.channel;
      if (!vc) {
        return await errorReply(
          t("handlers:command.voiceOnly", { lng: locale, command: commandName })
        );
      }

      if (!vc.joinable || !vc.speakable) {
        return await errorReply(
          t("handlers.command.missingVoicePerm", {
            lng: locale,
            command: commandName,
            channel: `<#${vc.id}>`,
          })
        );
      }

      if (
        vc.type === ChannelType.GuildStageVoice &&
        !vc.permissionsFor(clientMember).has("RequestToSpeak")
      ) {
        return await errorReply(
          t("handlers.command.noRequestToSpeak", {
            lng: locale,
            command: commandName,
            channel: `<#${vc.id}>`,
          })
        );
      }

      if (clientMember.voice.channel && clientMember.voice.channelId !== vc.id) {
        return await errorReply(
          t("handlers:command.differentVoiceChannel", {
            lng: locale,
            channel: `<#${clientMember.voice.channelId}>`,
          })
        );
      }
    }

    if (command.player?.active) {
      const player = client.lavalink.getPlayer(interaction.guildId);
      if (!player) {
        return await errorReply(t("player:noPlayer", { lng: locale }));
      }

      if (command.player?.playing && !player.queue.current) {
        return await errorReply(t("player:noPlayer", { lng: locale }));
      }
    }
  }

  if (command.cooldown > 0) {
    const remaining = getCooldown(client, command, user.id);
    if (remaining > 0 && !devUser) {
      return await errorReply(
        t("handlers:command.cooldown", {
          lng: locale,
          time: client.utils.formatTime(remaining, true),
          command: commandName,
        })
      );
    }
  }

  try {
    await command.executeSlash(client, interaction, metadata);
  } catch (error) {
    if (client.config.bot.debug) client.logger.error(error);
    else client.logger.error("An error occurred: " + error.message);
    return await errorReply(t("handlers:command.error", { lng: locale, command: commandName }));
  }
}

module.exports = { handleSlash };
