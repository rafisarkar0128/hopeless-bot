const { EmbedBuilder, Embed } = require("discord.js");
//const { OWNER_IDS, PREFIX_COMMANDS, EMBED_COLORS } = require("@root/config");
//const { parsePermissions } = require("@helpers/Utils");
// /const { timeformat } = require("@helpers/Utils");
const { getSettings } = require("@root/src/database/schemas/guild");

const cooldownCache = new Map();

module.exports = {
  /** A function to handle prefix commands
   * @param {import("@lib/DiscordBot").DiscordBot} client
   * @param {import('discord.js').Message} message
   * @param {import("@types/commands").CommandStructure} command
   * @param {object} settings
   */
  handlePrefixCommand: async function (client, message, command, settings) {
    const { config, colors, utils } = client;
    const { author, member, guild, channel } = message;

    const prefix = settings.prefix || config.bot.defaultPrefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const data = {};
    data.settings = settings;
    data.prefix = prefix;
    data.name = commandName;

    if (!channel.permissionsFor(guild.members.me).has("SendMessages")) {
      return author.send({
        content: `<@${author.id}>`,
        embeds: [
          new EmbedBuilder()
            .setTitle("**Missing Permissions**")
            .setDescription(
              `**I don't have \`SendMessages\` permission in <#${channel.id}>.**`,
            )
            .setColor(colors.Wrong),
        ],
      });
    }

    if (!command.run) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              "**The prefix version of this command isn't completed yet. Try the slash version**",
            )
            .setColor(colors.Wrong),
        ],
      });
    }

    if (!command.prefixCommand.enabled && !config.devs.includes(author.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("**This command is disabled by the bot owner or developers**.")
            .setColor(colors.Wrong),
        ],
      });
    }

    if (
      (command.isDevOnly || command.category === "DEVELOPMENT") &&
      !config.devs.includes(author.id)
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`**This command is only accessible to the bot owner & developers**`)
            .setColor(colors.Wrong),
        ],
      });
    }

    if (command.isGuildOnly && !message.inGuild()) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`**This command can only be used in a Guild _(Discord Server)_**`)
            .setColor(colors.Wrong),
        ],
      });
    }

    if (command.cooldown > 0) {
      const remainingTime = getRemainingTime(command, author.id);
      if (remainingTime > 0 && !config.devs.includes(author.id)) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle(
                `**Chill! Command in on cooldown wait for \`${remainingTime}\` seconds**`,
              )
              .setColor(colors.Wrong),
          ],
        });
      }
    }

    if (guild && !member.permissions.has(command?.userPermissions)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              `**You need \`${utils.parsePermissions(
                command.userPermissions,
              )}\` to use this command.**`,
            )
            .setColor(colors.Wrong),
        ],
      });
    }

    if (guild && !guild.members.me.permissions.has(command?.botPermissions)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              `**I need ${utils.parsePermissions(
                command.botPermissions,
              )} to execute this command.**`,
            )
            .setColor(colors.Wrong),
        ],
      });
    }

    if (command.isVCOnly && !member.voice.channel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(colors.Wrong)
            .setTitle("**You must have to be in a voice channel to use this command.**"),
        ],
      });
    }

    if (command.prefixCommand.minArgsCount > args.length) {
      const usageEmbed = this.getCommandUsage(client, command, prefix, commandName);
      return message.reply({ embeds: [usageEmbed] });
    }

    try {
      await command.run(client, message, args);
    } catch (error) {
      const reply = await message.reply({
        content: `${author}`,
        embeds: [
          new EmbedBuilder()
            .setColor(colors.StandBy)
            .setTitle(`** An error has occurred! Try again later!**`),
        ],
      });
      setTimeout(() => {
        reply.delete();
      }, 9000);

      throw error;
    } finally {
      if (command.cooldown > 0) setCooldown(command, author.id);
    }
  },

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  handleSlashCommand: async function (interaction) {
    const command = interaction.client.slashCommands.get(interaction.commandName);
    if (!command)
      return interaction
        .reply({ content: "An error has occurred", ephemeral: true })
        .catch(() => {});

    // callback validations
    if (command.validations) {
      for (const validation of command.validations) {
        if (!validation.callback(interaction)) {
          return interaction.reply({
            content: validation.message,
            ephemeral: true,
          });
        }
      }
    }

    // Owner commands
    if (command.category === "OWNER" && !OWNER_IDS.includes(interaction.user.id)) {
      return interaction.reply({
        content: `This command is only accessible to bot owners`,
        ephemeral: true,
      });
    }

    // user permissions
    if (interaction.member && command.userPermissions?.length > 0) {
      if (!interaction.member.permissions.has(command.userPermissions)) {
        return interaction.reply({
          content: `You need ${parsePermissions(
            command.userPermissions,
          )} for this command`,
          ephemeral: true,
        });
      }
    }

    // bot permissions
    if (command.botPermissions && command.botPermissions.length > 0) {
      if (!interaction.guild.members.me.permissions.has(command.botPermissions)) {
        return interaction.reply({
          content: `I need ${parsePermissions(command.botPermissions)} for this command`,
          ephemeral: true,
        });
      }
    }

    // cooldown check
    if (command.cooldown > 0) {
      const remaining = getRemainingCooldown(interaction.user.id, command);
      if (remaining > 0) {
        return interaction.reply({
          content: `You are on cooldown. You can again use the command in \`${timeformat(
            remaining,
          )}\``,
          ephemeral: true,
        });
      }
    }

    try {
      await interaction.deferReply({ ephemeral: command.slashCommand.ephemeral });
      const settings = await getSettings(interaction.guild);
      await command.interactionRun(interaction, { settings });
    } catch (ex) {
      await interaction.followUp("Oops! An error occurred while running the command");
      interaction.client.logger.error("interactionRun", ex);
    } finally {
      if (command.cooldown > 0) applyCooldown(interaction.user.id, command);
    }
  },

  /** Build a usage embed for this command
   * @param {import("@lib/DiscordBot").DiscordBot} client - base client
   * @param {import("@types/commands").CommandStructure} command - command object
   * @param {string} prefix - bot prefix
   * @param {string} alias - alias that was used to trigger this command
   * @returns {Embed}
   */
  getCommandUsage(client, command, prefix, alias) {
    let desc = "";
    if (command.prefixCommand.subcommands.length > 0) {
      command.prefixCommand.subcommands.forEach((sub) => {
        desc += `\`\`\`\n${prefix}${alias || command.name} ${sub.name}\n\`\`\`**❯ ${
          sub.description
        }**\n\n`;
      });
    } else {
      desc += `\`\`\`css\n${prefix}${alias || command.name} ${
        command.prefixCommand.usage
      }\`\`\``;
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
          `cooldown: ${command.cooldown}`,
          `**usage:** \`${prefix}${command.name} ${command.prefixCommand.usage}\``,
        ].join("\n"),
      )
      .setColor(client.colors.Aquamarine);

    return embed;
  },

  /**
   * @param {import('@structures/Command')} command - command object
   */
  getSlashUsage(command) {
    let desc = "";
    if (command.slashCommand.options.find((o) => o.type === "SUB_COMMAND")) {
      const subcommands = command.slashCommand.options.filter(
        (opt) => opt.type === "SUB_COMMAND",
      );
      subcommands.forEach((sub) => {
        desc += `\`/${command.name} ${sub.name}\`\n❯ ${sub.description}\n\n`;
      });
    } else {
      desc += `\`/${command.name}\`\n\n**Help:** ${command.description}`;
    }

    if (command.cooldown) {
      desc += `\n**Cooldown:** ${timeformat(command.cooldown)}`;
    }

    return new EmbedBuilder().setColor(EMBED_COLORS.BOT_EMBED).setDescription(desc);
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
