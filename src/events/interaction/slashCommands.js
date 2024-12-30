const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/guild");
const { t } = require("i18next");
const cooldownCache = new Map();

/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "interactionCreate",
  /** @param {ChatInputCommandInteraction} interaction */
  execute: async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { config, slashCommands, aliases } = client;
    const { commandName, user, member, guild } = interaction;
    const { timeFormat, parsePermissions } = client.utils;

    if (!config.command.slash.enabled) return;

    const settings = await getSettings(guild);
    const command = slashCommands.get(commandName);

    if (!command) {
      interaction.reply({
        content: "This command isn't available.",
        ephemeral: true,
      });
      await client.application.commands.delete(interaction.id);
      return;
    }

    await interaction.deferReply({
      ephemeral: command.ephemeral ?? true,
    });

    const rEmbed = new EmbedBuilder().setColor(config.colors.Wrong);
    const errEmbed = new EmbedBuilder().setColor(config.colors.Standby);

    try {
      if (command?.devOnly || command?.category === "DEVELOPMENT") {
        if (!config.devs.includes(user.id)) {
          await interaction.followUp({
            embeds: [rEmbed.setDescription(t("events:dev_only"))],
            ephemeral: true,
          });
          return;
        }
      }

      if (command?.guildOnly && !interaction.inGuild()) {
        await interaction.followUp({
          embeds: [rEmbed.setDescription(t("events:guild_only"))],
          ephemeral: true,
        });
        return;
      }

      if (command?.cooldown > 0) {
        const rTime = getRemainingTime(command, user.id);
        if (rTime > 0 && !config.devs.includes(user.id)) {
          await interaction.followUp({
            embeds: [
              rEmbed.setDescription(
                t("events:cooldown", { t: timeFormat(rTime * 1000) }),
              ),
            ],
            ephemeral: true,
          });
          return;
        }
      }

      if (guild || interaction.inGuild()) {
        if (!member.permissions.has(command?.userPermissions)) {
          await interaction.followUp({
            embeds: [
              rEmbed.setDescription(
                t("events:missing_user_permissions", {
                  p: parsePermissions(command.userPermissions),
                }),
              ),
            ],
            ephemeral: true,
          });
          return;
        }

        if (!guild.members.me.permissions.has(command?.botPermissions)) {
          await interaction.followUp({
            embeds: [
              rEmbed.setDescription(
                t("events:missing_bot_permissions", {
                  p: parsePermissions(command.botPermissions),
                }),
              ),
            ],
            ephemeral: true,
          });
          return;
        }

        if (command?.voiceChannelOnly) {
          const vc = member.voice?.channel;
          if (!vc) {
            await interaction.followUp({
              embeds: [rEmbed.setDescription(t("events:voice_channel_only"))],
              ephemeral: true,
            });
            return;
          }

          if (!vc.joinable || !vc.speakable) {
            await interaction.followUp({
              embeds: [rEmbed.setDescription(t("events:missing_vc_permissions"))],
              ephemeral: true,
            });
            return;
          }
        }
      }

      await command.execute(client, interaction, settings);
    } catch (error) {
      await interaction.followUp({
        content: `<@${user.id}>`,
        embeds: [errEmbed.setTitle(t("events:error"))],
        fetchReply: true,
      });

      throw error;
    } finally {
      if (command.cooldown > 0) setCooldown(command, user.id);
    }
  },
};

/**
 * @param {object} command
 * @param {string} userId
 * @returns {void}
 */
function setCooldown(command, userId) {
  const key = command.name + "-" + userId;
  cooldownCache.set(key, Date.now());
}

/**
 * @param {object} command
 * @param {string} userId
 * @returns {number}
 */
function getRemainingTime(command, userId) {
  const key = command.name + "-" + userId;
  if (cooldownCache.has(key)) {
    const remaining = (Date.now() - cooldownCache.get(key)) * 0.001;
    if (remaining > command.cooldown) {
      cooldownCache.delete(key);
      return 0;
    }
    return command.cooldown - remaining;
  }
  return 0;
}
