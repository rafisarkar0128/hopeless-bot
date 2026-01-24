const { ChannelType } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle slash commands
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").ButtonInteraction} interaction
 * @returns {Promise<void>}
 */
async function handleButton(client, interaction) {
  const { customId, user } = interaction;
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
  const button = client.buttons.get(customId);
  if (!button) {
    return await errorReply(t("handlers:button.notFound", { lng: locale }));
  }

  if (button.options.disabled && !devUser) {
    return await errorReply(t("handlers:button.disabled", { lng: locale }));
  }

  if (button.options.guildOnly && !interaction.inGuild()) {
    return await errorReply(t("handlers:button.guildOnly", { lng: locale }));
  }

  if (button.permissions?.dev && !devUser) {
    return await errorReply(t("handlers:button.devOnly", { lng: locale }));
  }

  if (interaction.inGuild()) {
    const clientMember = interaction.guild.members.resolve(client.user);

    const missingBotPermissions = button.permissions.bot.filter(
      (p) => !clientMember.permissions.has(p)
    );
    if (missingBotPermissions.length > 0) {
      return await errorReply(
        t("handlers:button.botPerm", {
          lng: locale,
          perms: missingBotPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
    }

    const missingUserPermissions = button.permissions.user.filter(
      (p) => !interaction.member.permissions.has(p)
    );
    if (missingUserPermissions.length > 0) {
      return await errorReply(
        t("handlers:button.userPerm", {
          lng: locale,
          perms: missingUserPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
    }

    if (button.player?.voice) {
      const vc = interaction.member.voice.channel;
      if (!vc) {
        return await errorReply(t("player:notInVoiceChannel", { lng: locale }));
      }

      if (!vc.joinable || !vc.speakable) {
        return await errorReply(
          t("player:noPermissions", { lng: locale, channelId: `<#${vc.id}>` })
        );
      }

      if (
        vc.type === ChannelType.GuildStageVoice &&
        !vc.permissionsFor(clientMember).has("RequestToSpeak")
      ) {
        return await errorReply(
          t("player:noRequestToSpeak", { lng: locale, channelId: `<#${vc.id}>` })
        );
      }

      if (clientMember.voice.channel && clientMember.voice.channelId !== vc.id) {
        return await errorReply(
          t("player:notConnected", {
            lng: locale,
            channelId: `<#${clientMember.voice.channelId}>`,
          })
        );
      }
    }

    if (button.player?.active) {
      const player = client.lavalink.players.get(interaction.guildId);
      if (!player) {
        return await errorReply(t("player:noPlayer", { lng: locale }));
      }

      if (button.player?.playing && !player.queue.current) {
        return await errorReply(t("player:noPlayer", { lng: locale }));
      }
    }
  }

  try {
    await button.execute(client, interaction, metadata);
  } catch (error) {
    if (client.config.debug) {
      client.logger.error("An error occurred: " + error.message);
      client.logger.debug(error);
    } else {
      client.logger.error("An error occurred: " + error.message);
    }

    return await errorReply(t("handlers:button.error", { lng: locale }));
  }
}

module.exports = { handleButton };
