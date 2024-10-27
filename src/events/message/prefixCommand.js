const { Message, EmbedBuilder, Embed } = require("discord.js");
const { getSettings } = require("@schemas/guild");
const { t } = require("i18next");
const cooldownCache = new Map();

/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "messageCreate",
  once: false,
  /**
   * types for parameters
   * @param {Message} message
   */
  execute: async (client, message) => {
    const { config, commands, aliases } = client;
    const { timeFormat, parsePermissions } = client.utils;
    if (!client.config.commands.prefix.enabled) return;

    const { author, member, guild, channel, content } = message;
    if (author.bot) return;
    if (!content) return;

    const settings = await getSettings(guild);
    const prefix = settings?.prefix || config.default_prefix;
    if (!content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));
    if (!command) return;

    const rEmbed = new EmbedBuilder().setColor(config.colors.Wrong);
    const errEmbed = new EmbedBuilder().setColor(config.colors.Standby);

    try {
      if (command?.devOnly || command?.category === "DEVELOPMENT") {
        if (!config.devs.includes(author.id)) {
          return message.reply({
            embeds: [rEmbed.setDescription(t("events:dev_only"))],
          });
        }
      }

      if (command?.guildOnly && !message.inGuild()) {
        return message.reply({
          embeds: [rEmbed.setDescription(t("events:guild_only"))],
        });
      }

      if (command?.minArgsCount > args.length) {
        const usageEmbed = getCommandUsage(client, command, prefix, commandName);
        return message.reply({ embeds: [usageEmbed] });
      }

      if (command?.cooldown > 0) {
        const rTime = getRemainingTime(command, author.id);
        if (rTime > 0 && !config.devs.includes(author.id)) {
          return message.reply({
            embeds: [
              rEmbed.setDescription(
                t("events:cooldown", { t: timeFormat(rTime * 1000) }),
              ),
            ],
          });
        }
      }

      if (guild || message.inGuild()) {
        if (!channel.permissionsFor(guild.members.me).has("SendMessages")) {
          return author.send({
            content: `<@${author.id}>`,
            embeds: [
              rEmbed.setTitle(t("events:missing_access.title")).setDescription(
                t("events:missing_access.description", {
                  chanel: "<#${channel.id}>",
                }),
              ),
            ],
          });
        }

        if (!member.permissions.has(command?.userPermissions)) {
          return message.reply({
            embeds: [
              rEmbed.setDescription(
                t("events:missing_user_permissions", {
                  p: parsePermissions(command.userPermissions),
                }),
              ),
            ],
          });
        }

        if (!guild.members.me.permissions.has(command?.botPermissions)) {
          return message.reply({
            embeds: [
              rEmbed.setDescription(
                t("events:missing_bot_permissions", {
                  p: parsePermissions(command.botPermissions),
                }),
              ),
            ],
          });
        }

        if (command?.voiceChannelOnly) {
          const vc = member.voice.channel;
          if (!vc) {
            return message.reply({
              embeds: [rEmbed.setDescription(t("events:voice_channel_only"))],
            });
          }

          if (!vc.joinable || !vc.speakable) {
            return interaction.reply({
              embeds: [rEmbed.setDescription(t("events:missing_vc_permissions"))],
            });
          }
        }
      }

      await command.execute(client, message, args, settings);
    } catch (error) {
      const reply = await message.reply({
        content: `<@${author.id}>`,
        embeds: [errEmbed.setTitle(t("events:error"))],
      });

      setTimeout(() => {
        reply.delete();
      }, 5000);

      throw error;
    } finally {
      if (command.cooldown > 0) setCooldown(command, author.id);
    }
  },
};

/**
 * Build a usage embed for this command
 * @param {import("@lib/DiscordBot").DiscordBot} client - base client
 * @param {import("@structures/command.d.ts").PrefixCommandStructure} command - command object
 * @param {string} prefix - bot prefix
 * @param {string} alias - alias that was used to trigger this command
 * @returns {Embed}
 */
function getCommandUsage(client, command, prefix, alias) {
  let desc = "";
  if (command.subcommands.length > 0) {
    command.subcommands.forEach((sub) => {
      desc += `\`\`\`\n${prefix}${alias || command.name} ${sub.name}\n\`\`\`**❯ ${
        sub.description
      }**\n\n`;
    });
  } else {
    desc += `\`\`\`css\n${prefix}${alias || command.name} ${command.usage}\`\`\``;
    if (command.description !== "") desc += `\ndescription: ${command.description}`;
  }

  if (command.cooldown) {
    desc += `\n**Cooldown:** ${client.utils.timeFormat(command.cooldown * 1000)}s`;
  }

  const embed = new EmbedBuilder()
    .setTitle("Command Usage")
    .setDescription(
      [
        `Name: ${command.name}`,
        `description: ${command?.description}`,
        `cooldown: ${client.utils.timeFormat(command.cooldown * 1000)}`,
        `**usage:** \`${prefix}${command.name} ${command.usage}\``,
      ].join("\n"),
    )
    .setColor(client.colors.Aquamarine);

  return embed;
}

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
