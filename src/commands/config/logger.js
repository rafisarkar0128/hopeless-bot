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
    name: "logger",
    description: "Setup remote logger for logging.",
    aliases: ["log", "logg", "lg", "loger", "looger"],
    usage: "<subcommand> <options>",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message, args, data) => {
      message.reply({
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
      .setName("logger")
      .setDescription("Setup remote logger for logging.")
      .setContexts(InteractionContextType.Guild)
      .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
      .addSubcommand((option) =>
        option
          .setName("setup")
          .setDescription("Setupt remote logging system")
          .addStringOption((option) =>
            option
              .setName("category")
              .setDescription("Select a category")
              .setRequired(true)
              .setChoices([
                {
                  name: "general",
                  value: "general",
                },
                {
                  name: "error",
                  value: "error",
                },
                {
                  name: "join",
                  value: "join",
                },
                {
                  name: "leave",
                  value: "leave",
                },
                {
                  name: "command",
                  value: "command",
                },
                {
                  name: "music",
                  value: "music",
                },
              ]),
          )
          .addChannelOption((option) =>
            option
              .setName("channel")
              .setDescription("The channel to mark as log channel")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(false),
          )
          .addMentionableOption((option) =>
            option
              .setName("roles")
              .setDescription("The roles to be mentioned when logger send a message.")
              .setRequired(false),
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
    global: true,
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
