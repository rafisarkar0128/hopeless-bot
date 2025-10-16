const { EmbedBuilder, ChannelType } = require("discord.js");
const { t } = require("i18next");
const { getCooldown } = require("@utils/index");

/**
 * A function to create an embed for missing arguments
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("@structures/index").BaseCommand} command
 * @param {import("@database/index").Structures.Guild} metadata
 * @returns {EmbedBuilder}
 */
function getMissingArgsEmbed(client, command, metadata) {
  let examples = [];
  for (const example of command.details.examples) {
    examples.push(`- ${example.replace("{prefix}", metadata.prefix)}`);
  }

  const embed = new EmbedBuilder()
    .setColor(client.colors.error)
    .setTitle(t("handlers:command.missingArgs", { lng: metadata.locale }))
    .setDescription(
      t("handlers:command.missingArgsDescription", {
        lng: metadata.locale,
        command: command.data.name,
      })
    )
    .setFields([
      {
        name: t("handlers:command.usageTitle", { lng: metadata.locale }),
        value: `\`${command.details.usage.replace("{prefix}", metadata.prefix)}\``,
      },
      {
        name: t("handlers:command.examplesTitle", { lng: metadata.locale }),
        value: examples.join("\n"),
      },
    ])
    .setFooter({
      text: t("handlers:command.syntaxFooter", { lng: metadata.locale }),
    });

  return embed;
}

/**
 * A function to handle prefix commands
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").Message<true>} message
 * @returns {Promise<void>}
 */
async function handlePrefix(client, message) {
  let metadata = await client.mongodb.guilds.get(message.guildId);
  if (!metadata) {
    metadata = await client.mongodb.guilds.create(message.guildId);
  }
  const { prefix, locale } = metadata;

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(`^(<@!?${client.user?.id}>|${escapeRegex(prefix)})\\s*`);

  if (!prefixRegex.test(message.content)) return;
  const match = message.content.match(prefixRegex);
  if (!match) return;

  const [matchedPrefix] = match;
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command =
    client.commands.get(commandName) ?? client.commands.get(client.aliases.get(commandName));
  if (!command) return;

  const errEmbed = new EmbedBuilder().setColor(client.colors.error);
  const { options, prefixOptions } = command;
  const devUser = client.config.bot.devs?.includes(message.author.id);

  /**
   * A function to send reply and delete it afterward
   * @param {string} text - The text to send
   * @returns {Promise<void>}
   */
  async function replyAndDelete(text) {
    errEmbed.setDescription(text);
    const reply = await message.reply({ embeds: [errEmbed] });
    setTimeout(async () => {
      if (message.deletable) await message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 10_000);
  }

  if (prefixOptions.disabled && !devUser) {
    return await replyAndDelete(
      t("handlers:command.disabled", { lng: locale, command: commandName })
    );
  }

  if (options.guildOnly && !message.inGuild()) {
    return await replyAndDelete(
      t("handlers:command.guildOnly", { lng: locale, command: commandName })
    );
  }

  if (options.permissions?.dev && !devUser) {
    return await replyAndDelete(
      t("handlers:command.devOnly", { lng: locale, command: commandName })
    );
  }

  if (message.inGuild()) {
    const clientMember = message.guild.members.resolve(client.user);
    let mustHavePerms = ["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"];

    if (!clientMember.permissions.has(mustHavePerms)) {
      errEmbed.setDescription(
        t("handlers:command.noBotPerm", {
          lng: locale,
          channel: `<#${message.channelId}>`,
          perms: ["ViewChannel", "SendMessages", "EmbedLinks", "ReadMessageHistory"]
            .map((p) => `- **${p}**`)
            .join("\n"),
        })
      );
      return await message.author.send({ embeds: [errEmbed] }).catch(() => null);
    }

    const missingBotPermissions = options.permissions.bot.filter(
      (p) => !clientMember.permissions.has(p)
    );
    if (missingBotPermissions.length > 0) {
      return await replyAndDelete(
        t("handlers:command.botPerm", {
          lng: locale,
          command: commandName,
          perms: missingBotPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
    }

    const missingUserPermissions = options.permissions.user.filter(
      (p) => !message.member.permissions.has(p)
    );
    if (missingUserPermissions.length > 0) {
      return await replyAndDelete(
        t("handlers:command.userPerm", {
          lng: locale,
          command: commandName,
          perms: missingUserPermissions.map((p) => `- **${p}**`).join("\n"),
        })
      );
    }

    if (options.player?.voice) {
      const vc = message.member.voice.channel;
      if (!vc) {
        return await replyAndDelete(
          t("handlers:command.voiceOnly", { lng: locale, command: commandName })
        );
      }

      if (!vc.joinable || !vc.speakable) {
        return await replyAndDelete(
          t("handlers:command.missingVoicePerm", { lng: locale, channel: `<#${vc.id}>` })
        );
      }

      if (
        vc.type === ChannelType.GuildStageVoice &&
        !vc.permissionsFor(clientMember).has("RequestToSpeak")
      ) {
        return await replyAndDelete(
          t("handlers:command.noRequestToSpeak", { lng: locale, command: commandName })
        );
      }

      if (clientMember.voice.channel && clientMember.voice.channelId !== vc.id) {
        return await replyAndDelete(
          t("handlers:command.differentVoiceChannel", {
            lng: locale,
            channel: `<#${clientMember.voice.channelId}>`,
          })
        );
      }
    }

    if (options.player?.active) {
      const player = client.lavalink.getPlayer(message.guildId);
      if (!player) {
        return await replyAndDelete(t("player:noPlayer", { lng: locale }));
      }
      if (options.player?.playing && !player.queue.current) {
        return await replyAndDelete(t("player:noPlayer", { lng: locale }));
      }
    }
  }

  if (prefixOptions.minArgsCount > args.length) {
    const missingArgsEmbed = getMissingArgsEmbed(client, command, metadata);
    const reply = await message.reply({ embeds: [missingArgsEmbed] });
    return setTimeout(() => {
      if (message.deletable) message.delete();
      reply.delete();
    }, 15_000);
  }

  if (args.includes("@everyone") || args.includes("@here")) {
    return await replyAndDelete(t("handlers:command.noMentionEveryone", { lng: locale }));
  }

  if (options.cooldown > 0) {
    const remaining = getCooldown(client, command, message.author.id);
    if (remaining > 0 && !devUser) {
      return await replyAndDelete(
        t("handlers:command.cooldown", { lng: locale, time: remaining, command: commandName })
      );
    }
  }

  try {
    return await command.executePrefix(client, message, args, metadata);
  } catch (error) {
    if (client.config.debug) client.logger.error(error);
    else client.logger.error("An error occurred: " + error.message);

    errEmbed.setDescription(t("handlers:command.error", { lng: locale, command: commandName }));
    const messages = await message.channel.messages.fetch({ limit: 100 });
    const messageReplies = messages.filter(
      (msg) => msg.reference && msg.reference.messageId === message.id
    );

    // If there are replies to the original message, send the error embed in the reply
    // then add the reply to the list of messageReplies to be deleted later
    if (messageReplies && messageReplies.size > 0) {
      const reply = await message.reply({ embeds: [errEmbed] });
      messageReplies.set(reply.id, reply);
    } else {
      const reply = await message.reply({ embeds: [errEmbed] });
      messageReplies.set(reply.id, reply);
    }

    setTimeout(() => {
      if (message.deletable) message.delete().catch(() => {});
      message.channel.bulkDelete(messageReplies, true).catch(() => {});
    }, 10_000);
  }
}

// if (command.player.dj) {
//   const dj = await this.client.db.getDj(message.guildId);
//   if (dj?.mode) {
//     const djRole = await this.client.db.getRoles(message.guildId);
//     if (!djRole) {
//       return await replyAndDelete({
//         content: t("event.message.no_dj_role", {lng: locale,})
//       });
//     }
//
//     const hasDJRole = message.member.roles.cache.some((role) =>
//       djRole.map((r) => r.roleId).includes(role.id)
//     );
//     if (
//       !(
//         devUser ||
//         (hasDJRole &&
//           !message.member.permissions.has(PermissionFlagsBits.ManageGuild))
//       )
//     ) {
//       await replyAndDelete({
//         content: t("event.message.no_dj_permission", {
//           lng: locale
//         })
//       });
//       return;
//     }
//   }
// }

// if (command.vote && this.client.env.TOPGG) {
//   const voted = await this.client.topGG.hasVoted(message.author.id);
//   if (!(devUser || voted)) {
//     const voteBtn = new ActionRowBuilder().addComponents(
//       new ButtonBuilder()
//         .setLabel(t("event.message.vote_button"))
//         .setURL(`https://top.gg/bot/${this.client.user?.id}/vote`)
//         .setStyle(ButtonStyle.Link)
//     );
//
//     return await replyAndDelete({
//       content: t("event.message.vote_message"),
//       components: [voteBtn]
//     });
//   }
// }

// const setup = await this.client.db.getSetup(message.guildId);
// if (setup && setup.textId === message.channelId) {
//   return this.client.emit("setupSystem", message);
// }

// const logs = this.client.channels.cache.get(this.client.env.LOG_COMMANDS_ID);
// if (logs) {
//   const embed = new EmbedBuilder()
//     .setAuthor({
//       name: "Prefix - Command Logs",
//       iconURL: this.client.user?.avatarURL({ size: 2048 })
//     })
//     .setColor(this.client.config.color.green)
//     .addFields(
//       { name: "Command", value: `\`${commandName}\``, inline: true },
//       {
//         name: "User",
//         value: `${message.author.tag} (\`${message.author.id}\`)`,
//         inline: true
//       },
//       {
//         name: "Guild",
//         value: `${message.guild.name} (\`${message.guild.id}\`)`,
//         inline: true
//       }
//     )
//     .setTimestamp();
//
//   await logs.send({ embeds: [embed] });
// }

module.exports = { handlePrefix };
