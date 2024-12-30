const { EmbedBuilder, Embed } = require("discord.js");
const { getSettings } = require("@root/src/schemas/guild");

module.exports = {
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
