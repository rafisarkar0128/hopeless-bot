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
  const errEmbed = new EmbedBuilder().setColor(client.color.Wrong);
  const locale = "en-US"; // await client.db.guilds.getLocale(interaction.guildId);
  const devUser = client.config.bot.devs?.includes(user.id);

  const command = client.commands.get(commandName);
  if (!command) {
    errEmbed.setDescription(t("handlers:command.notFound", { lng: locale, command: commandName }));
    await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
    // return await interaction.command.delete();
  }

  const { data, options, slashOptions } = command;

  if (options.guildOnly && !interaction.inGuild()) {
    errEmbed.setDescription(t("handlers:command.guildOnly", { lng: locale, command: commandName }));
    return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
  }

  if (options.permissions?.dev && !devUser) {
    errEmbed.setDescription(t("handlers:command.devOnly", { lng: locale, command: commandName }));
    return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
  }

  if (interaction.inGuild()) {
    const clientMember = interaction.guild.members.resolve(client.user);
    const missingBotPermissions = options.permissions.bot.filter(
      (p) => !clientMember.permissions.has(p)
    );

    if (missingBotPermissions.length > 0) {
      errEmbed.setDescription(
        t("handlers:command.botPerm", {
          lng: locale,
          command: commandName,
          perms: missingBotPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
      return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
    }

    const missingUserPermissions = options.permissions.user.filter(
      (p) => !interaction.member.permissions.has(p)
    );
    if (missingUserPermissions.length > 0) {
      errEmbed.setDescription(
        t("handlers:command.userPerm", {
          lng: locale,
          command: commandName,
          perms: missingUserPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
      return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
    }

    if (options.player?.voice) {
      const vc = interaction.member.voice.channel;
      if (!vc) {
        errEmbed.setDescription(
          t("handlers:command.voiceOnly", { lng: locale, command: commandName })
        );
        return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
      }

      if (!vc.joinable || !vc.speakable) {
        errEmbed.setDescription(
          t("handlers.command.missingVoicePerm", {
            lng: locale,
            command: commandName,
            channel: `<#${vc.id}>`,
          })
        );
        return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
      }

      if (
        vc.type === ChannelType.GuildStageVoice &&
        !vc.permissionsFor(clientMember).has("RequestToSpeak")
      ) {
        errEmbed.setDescription(
          t("handlers.command.noRequestToSpeak", {
            lng: locale,
            command: commandName,
            channel: `<#${vc.id}>`,
          })
        );
        return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
      }

      if (clientMember.voice.channel && clientMember.voice.channelId !== vc.id) {
        errEmbed.setDescription(
          t("handlers:command.differentVoiceChannel", {
            lng: locale,
            channel: `<#${clientMember.voice.channelId}>`,
          })
        );
        return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
      }
    }

    if (command.player?.active) {
      const player = client.lavalink.getPlayer(interaction.guildId);
      if (!player) {
        errEmbed.setDescription(t("player:noPlayer", { lng: locale }));
        return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
      }

      if (command.player?.playing && !player.queue.current) {
        errEmbed.setDescription(t("player:noPlayer", { lng: locale }));
        return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
      }
    }
  }

  // checking for command cooldowns
  if (command.cooldown > 0) {
    const remaining = getCooldown(client, command, user.id);
    if (remaining > 0 && !devUser) {
      errEmbed.setDescription(
        t("handlers:command.cooldown", {
          lng: locale,
          time: client.utils.formatTime(remaining, true),
          command: commandName,
        })
      );
      return await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
    }
  }

  try {
    await command.executeSlash(client, interaction, { lng: locale });
  } catch (error) {
    client.logger.error(error);
    errEmbed.setDescription(t("handlers:command.error", { lng: locale, error: error.message }));

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ embeds: [errEmbed] });
    } else {
      await interaction.reply({ embeds: [errEmbed], flags: "Ephemeral" });
    }
  }
}

module.exports = { handleSlash };
