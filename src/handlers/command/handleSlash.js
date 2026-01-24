const { ChannelType, EmbedBuilder } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle slash commands
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
 * @returns {Promise<void>}
 */
async function handleSlash(client, interaction) {
  const { commandName, user } = interaction;
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
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: text, flags: "Ephemeral" });
    } else {
      await interaction.reply({ content: text, flags: "Ephemeral" });
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
          t("player:notInVoiceChannel", { lng: locale, command: commandName })
        );
      }

      if (!vc.joinable || !vc.speakable) {
        return await errorReply(
          t("player:noPermissions", {
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
          t("player:noRequestToSpeak", {
            lng: locale,
            command: commandName,
            channel: `<#${vc.id}>`,
          })
        );
      }

      if (clientMember.voice.channel && clientMember.voice.channelId !== vc.id) {
        return await errorReply(
          t("player:notConnected", {
            lng: locale,
            channel: `<#${clientMember.voice.channelId}>`,
          })
        );
      }
    }

    if (options.player?.active) {
      const player = client.lavalink.players.get(interaction.guildId);
      if (!player) {
        return await errorReply(t("player:noPlayer", { lng: locale }));
      }

      if (options.player?.playing && !player.queue.current) {
        return await errorReply(t("player:noPlayer", { lng: locale }));
      }
    }
  }

  if (options.cooldown > 0) {
    const remaining = client.utils.getCooldown(command, user.id);
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
    if (client.config.debug) {
      client.logger.error("An error occurred: " + error.message);
      client.logger.debug(error);
    } else {
      client.logger.error("An error occurred: " + error.message);
    }

    return await errorReply(t("handlers:command.error", { lng: locale, command: commandName }));
  }
}

module.exports = { handleSlash };
