const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "config",
    cooldown: 0,
    premium: false,
    guildOnly: true,
    devOnly: true,
    voiceChannelOnly: false,
    botPermissions: [
      "SendMessages",
      "AddReactions",
      "ManageMessages",
      "EmbedLinks",
      "ReadMessageHistory",
      "ViewChannel",
      "ManageChannels",
    ],
    userPermissions: [],
  },
  prefix: {
    name: "errorlog",
    description: "Config the error logging system for the bot",
    aliases: ["errlog", "elog", "error", "logger"],
    usage: "<subcommand> <options>",
    disabled: true,
    minArgsCount: 1,
    subcommands: [],
    execute: (client, message, args, data) => {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("**This Command is Still in Development**")
            .setColor(client.colors.Wrong),
        ],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("errorlog")
      .setDescription("Config the error logging system for the bot")
      .setContexts(InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
      .addSubcommand((option) =>
        option
          .setName("create")
          .setDescription("Create a new error logging system")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("The channel to mark as log channel")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option.setName("delete").setDescription("Delete the error logging system"),
      )
      .addSubcommand((option) =>
        option.setName("preview").setDescription("Test the error logging system"),
      )
      .addSubcommand((option) =>
        option
          .setName("update")
          .setDescription("Update the error logging system")
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("The channel to mark as log channel")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true),
          )
          .addBooleanOption((option) =>
            option
              .setName("enable")
              .setDescription("Enable or disable the category")
              .setRequired(true),
          ),
      ),
    usage: "[subcommand | subcommandgroup]: <name> [options]?: <options>",
    ephemeral: true,
    global: false,
    disabled: false,
    execute: async (client, interaction, data) => {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("**This Command is Still in Development**")
            .setColor(client.colors.Wrong),
        ],
      });

      const channel = interaction.options.getChannel("channel");
      const doc = await errorlog.findOne({
        Enabled: "true",
      });

      if (!channel && !doc) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(client.colors.wrong)
              .setDescription(
                "❌ **As there is no error message logging system and no channel has been provided so I am going to do nothing.**",
              ),
          ],
        });
      }

      if (!channel && doc) {
        await errorlog.findOneAndDelete({
          Enabled: "true",
        });
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(client.colors.wrong)
              .setDescription(
                "**❌ As no channel has been provided so I have disabled the error message logging system.**",
              ),
          ],
        });
      }

      if (channel && !doc) {
        await errorlog.create({
          Channel: channel.id,
          Enabled: "true",
        });
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(client.colors.good)
              .setDescription(
                `**✅ Successfully enabled the error message logging system. <#${channel.id}> | This channel has been set to log error messages.**`,
              ),
          ],
        });
      }

      if (channel && doc) {
        await errorlog.findOneAndUpdate(
          {
            Enabled: "true",
          },
          {
            Channel: channel.id,
          },
        );
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setColor(client.colors.good)
              .setDescription(
                `**✅ Successfully updated error message logging utility. <#${channel.id}> | This channel has been set to log error messages.**`,
              ),
          ],
        });
      }
    },
  },
};
