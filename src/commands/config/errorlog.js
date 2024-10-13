const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
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
        )
        .addStringOption((option) =>
          option
            .setName("category")
            .setDescription("Select a category to setup")
            .addChoices([
              {
                name: "All",
                value: "all",
              },
              {
                name: "INTERACTIONS",
                value: "interactions",
              },
              {
                name: "MESSAGES",
                value: "messages",
              },
              {
                name: "EVENTS",
                value: "events",
              },
              {
                name: "INTERNAL",
                value: "internal",
              },
              {
                name: "EXTERNAL",
                value: "external",
              },
              {
                name: "PLAYER",
                value: "player",
              },
            ])
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
        .addStringOption((option) =>
          option
            .setName("categories")
            .setDescription("Select a category to update")
            .addChoices([
              {
                name: "INTERACTIONS",
                value: "interactions",
              },
              {
                name: "MESSAGES",
                value: "messages",
              },
              {
                name: "EVENTS",
                value: "events",
              },
              {
                name: "INTERNAL",
                value: "internal",
              },
              {
                name: "EXTERNAL",
                value: "external",
              },
              {
                name: "PLAYER",
                value: "player",
              },
            ])
            .setRequired(true),
        )
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
  ephemeral: true,
  cooldown: 0,
  category: "CONFIG",
  usage: {
    prefix: "[<subcommand>] <options>",
    slash: "",
  },
  aliases: ["errlog", "elog", "error", "logger"],
  minArgsCount: 1,
  isPrefixDisabled: false,
  isSlashDisabled: false,
  isPremium: false,
  isGlobal: false,
  isGuildOnly: true,
  isDevOnly: true,
  isVoiceChannelOnly: false,
  botPermissions: ["SendMessages", "AddReactions", "ManageMessages"],
  userPermissions: [],
  run: (client, message, args, data) => {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("**This Command is Still in Development**")
          .setColor(client.colors.Wrong),
      ],
    });
  },
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
};
