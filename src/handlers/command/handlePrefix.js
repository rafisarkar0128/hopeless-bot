const { EmbedBuilder, ChannelType } = require("discord.js");
const { t } = require("i18next");
// const Context = require("@root/archive/Context.js");
const { getCooldown } = require("@utils/index");

/**
 * A function to handle prefix commands
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").Message<true>} message
 * @returns {Promise<void>}
 */
async function handlePrefix(client, message) {
  // const guildConfig = await client.db.guilds.get(message.guildId);
  // const prefix = guildConfig.prefix ?? client.config.bot.prefix;
  const prefix = client.config.bot.prefix;
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(`^(<@!?${client.user?.id}>|${escapeRegex(prefix)})\\s*`);

  if (!prefixRegex.test(message.content)) return;
  const match = message.content.match(prefixRegex);
  if (!match) return;

  const [matchedPrefix] = match;
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const locale = "en-US"; //guildConfig.locale ?? client.config.defaultLocale;
  const errEmbed = new EmbedBuilder().setColor(client.color.Wrong);
  const command =
    client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (!command) return;
  const { options, prefixOptions } = command;

  // const ctx = new Context(message, args);
  // ctx.guildLocale = locale;
  const devUser = client.config.bot.devs?.includes(message.author.id);

  /**
   * A function to send reply and delete it afterward
   * @param {string} text
   * @returns {Promise<void>}
   */
  const replyAndDelete = async (text) => {
    errEmbed.setDescription(text);
    if (message.replied) {
      await message.editReply({
        content: "",
        embeds: [errEmbed],
        allowedMentions: { repliedUser: false },
      });
    } else {
      await message.reply({ embeds: [errEmbed] });
    }
    return setTimeout(() => message.deleteReply(), 9000);
  };

  if (options.guildOnly && !message.inGuild()) {
    return await replyAndDelete(
      t("handlers:command.guildOnly", { lng: locale, command: command.name })
    );
  }

  if (options.permissions?.dev && !devUser) {
    return await replyAndDelete(
      t("handlers:command.devOnly", { lng: locale, command: command.name })
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

    // Checking if the client has necessary permissions to execute this command.
    if (command.permissions?.bot) {
      const missing = options.permissions.bot.filter((p) => !clientMember.permissions.has(p));
      if (missing.length > 0) {
        return await replyAndDelete(
          t("handlers:command.botPerm", {
            lng: locale,
            command: command.name,
            perms: missing.map((p) => `- **${p}**`).join("\n"),
          })
        );
      }
    }

    // Checking if the user has necessary permissions to execute this command.
    if (command.permissions?.user) {
      const missing = options.permissions.user.filter((p) => !message.member.permissions.has(p));
      if (missing.length > 0) {
        return await replyAndDelete(
          t("handlers:command.userPerm", {
            lng: locale,
            command: command.name,
            perms: missing.map((p) => `- **${p}**`).join("\n"),
          })
        );
      }
    }

    // checking for music commands.
    if (options.player?.voice) {
      // the voice channel if user is connect to one
      const vc = message.member.voice.channel;

      // checking if user is connected to a voice channel or not
      if (!vc) {
        return await replyAndDelete(
          t("handlers:command.voiceOnly", {
            lng: locale,
            command: command.name,
          })
        );
      }

      // checking for necessary permissions
      if (!vc.joinable || !vc.speakable) {
        return await replyAndDelete(
          t("handlers:command.missingVoicePerm", {
            lng: locale,
            channel: `<#${vc.id}>`,
          })
        );
      }

      // checking for stage channel permissions
      if (
        vc.type === ChannelType.GuildStageVoice &&
        !vc.permissionsFor(clientMember).has("RequestToSpeak")
      ) {
        return await replyAndDelete(
          t("handlers:command.noRequestToSpeak", { lng: locale, command: command.name })
        );
      }

      // checking for different voice channel
      if (clientMember.voice.channel && clientMember.voice.channelId !== vc.id) {
        return await replyAndDelete(
          t("handlers:command.differentVoiceChannel", {
            lng: locale,
            channel: `<#${clientMember.voice.channelId}>`,
          })
        );
      }
    }

    // checking for active players
    if (options.player?.active) {
      const player = client.lavalink.getPlayer(message.guildId);
      if (!player) {
        return await replyAndDelete(t("player:noPlayer", { lng: locale }));
      }
    }
  }

  if (prefixOptions.minArgsCount > args.length) {
    errEmbed
      .setTitle(t("handlers:command.missingArgs", { lng: locale }))
      .setDescription(
        t("handlers:command.missingArgsDescription", {
          lng: locale,
          command: command.name,
          examples: command.description.examples.join("\n"),
        })
      )
      .setFooter({
        text: t("handlers:command.syntaxFooter", { lng: locale }),
      });

    await message.reply({ embeds: [errEmbed] });
    return setTimeout(() => message.deleteReply(), 15_000);
  }

  if (args.includes("@everyone") || args.includes("@here")) {
    return await replyAndDelete(t("handlers:command.noMentionEveryone", { lng: locale }));
  }

  if (options.cooldown > 0) {
    const remaining = getCooldown(client, command, message.author.id);
    if (remaining > 0 && !devUser) {
      return await replyAndDelete(
        t("handlers:command.cooldown", {
          lng: locale,
          time: remaining,
          command: commandName,
        })
      );
    }
  }

  try {
    return await command.executePrefix(client, message, args, { lng: locale });
  } catch (error) {
    client.logger.error(error);
    return await replyAndDelete(t("handlers:command.error", { lng: locale, error: error.message }));
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

// const locale = await this.client.db.getLanguage(message.guildId);
// const guild = await this.client.db.get(message.guildId);

// const logs = this.client.channels.cache.get(this.client.env.LOG_COMMANDS_ID);
// if (logs) {
//   const embed = new EmbedBuilder()
//     .setAuthor({
//       name: "Prefix - Command Logs",
//       iconURL: this.client.user?.avatarURL({ size: 2048 })
//     })
//     .setColor(this.client.config.color.green)
//     .addFields(
//       { name: "Command", value: `\`${command.name}\``, inline: true },
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
