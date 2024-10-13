const { UserContextMenuCommandInteraction, EmbedBuilder } = require("discord.js");

/** @type {import("@types/events").EventStructure} */
module.exports = {
  name: "interactionCreate",
  once: false,
  rest: false,
  ws: false,
  moonlink: false,
  /**
   * @param {UserContextMenuCommandInteraction} interaction
   */
  async execute(client, interaction) {
    if (!interaction.isUserContextMenuCommand()) return;

    const { config, colors, utils } = client;
    const { commandName, user, member, guild } = interaction;

    try {
      const context = client.contexts.get(commandName);

      await interaction.deferReply({
        ephemeral: context.ephemeral,
      });

      const mEmbed = new EmbedBuilder()
        .setTitle("**This command isn't available. Try again later.**")
        .setColor(colors.Wrong);
      if (!context || !context.execute) {
        return interaction.reply({
          embeds: [mEmbed],
          ephemeral: true,
        });
      }

      const dvEmbed = new EmbedBuilder()
        .setTitle(`**Only the owner or developers are allowed to use this command.**`)
        .setColor(colors.Wrong);
      if (
        (context.devOnly || context.category === "DEVELOPMENT") &&
        !config.devs.includes(user.id)
      ) {
        return interaction.reply({
          embeds: [dvEmbed],
          ephemeral: true,
        });
      }

      const gEmbed = new EmbedBuilder()
        .setTitle(`**This command can only be used in a __Guild (Discord Server)__**`)
        .setColor(colors.Wrong);
      if (context.guildOnly && !interaction.inGuild()) {
        return interaction.reply({
          embeds: [gEmbed],
          ephemeral: true,
        });
      }

      //const timestamps = client.cooldowns.get(context.data.name);
      //const cooldown = (context.cooldown || 3) * 1000;
      //const remainingTime = utils.getRemainingTime(timestamps, cooldown, user.id);
      //const cdEmbed = new EmbedBuilder()
      //  .setTitle(`**Chill! Embed in on cooldown wait for \`${remainingTime}\` seconds**`)
      //  .setColor(colors.Wrong);
      //if (remainingTime && !config.devs.includes(user.id)) {
      //  return interaction.reply({
      //    embeds: [cdEmbed],
      //    ephemeral: true,
      //  });
      //}

      const uPermission = new EmbedBuilder()
        .setTitle(
          `**You need \`${utils.parsePermissions(
            context.userPermissions,
          )}\` to use this command.**`,
        )
        .setColor(colors.Wrong);
      if (member && !member.permissions.has(context?.userPermissions)) {
        return interaction.reply({
          embeds: [uPermission],
          ephemeral: true,
        });
      }

      const bPermission = new EmbedBuilder()
        .setTitle(
          `**I need ${utils.parsePermissions(
            context.botPermissions,
          )} to execute this command.**`,
        )
        .setColor(colors.Wrong);
      if (member && !guild.members.me.permissions.has(context?.botPermissions)) {
        return interaction.reply({
          embeds: [bPermission],
          ephemeral: true,
        });
      }

      return context.execute(client, interaction);
    } catch (error) {
      const eCommand = new EmbedBuilder()
        .setColor(colors.StandBy)
        .setTitle(`** An error has occurred! Try again later!**`);

      if (interaction.isRepliable() || !interaction.replied) {
        interaction.reply({
          content: `${interaction.user}`,
          embeds: [eCommand],
          ephemeral: true,
        });
      }

      if (interaction.replied || interaction.deferred) {
        const message = await interaction.editReply({
          content: `${interaction.user}`,
          embeds: [eCommand],
        });

        setTimeout(() => {
          message.delete();
        }, 9000);
      }

      throw error;
    }
  },
};
