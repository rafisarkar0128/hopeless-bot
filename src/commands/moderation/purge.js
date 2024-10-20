const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "moderation",
    cooldown: 25,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: [
      "SendMessages",
      "ModerateMembers",
      "ReadMessageHistory",
      "ManageMessages",
    ],
    userPermissions: ["SendMessages", "ModerateMembers"],
  },
  prefix: {
    name: "",
    description: "",
    aliases: ["clear", "delete", "del", "clean"],
    usage: "<suncommand> <options>",
    disabled: true,
    minArgsCount: 2,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("purge")
      .setDescription("🧹 Delete bulk amount of messages")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addSubcommand((option) =>
        option
          .setName("bots")
          .setDescription("Delete messages that were sent by bots")
          .addIntegerOption((option) =>
            option
              .setName("count")
              .setDescription("Number of messages to delete. Limit 100")
              .setMaxValue(100)
              .setMinValue(1)
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("any")
          .setDescription("Delete messages of any type")
          .addIntegerOption((option) =>
            option
              .setName("count")
              .setDescription("Number of messages to delete. Limit 100")
              .setMaxValue(100)
              .setMinValue(1)
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("user")
          .setDescription("Delete messages that were sent by a user")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("Select a user to delete messages")
              .setRequired(true),
          )
          .addIntegerOption((option) =>
            option
              .setName("count")
              .setDescription("Number of messages to delete. Limit 100")
              .setMaxValue(100)
              .setMinValue(1)
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("after")
          .setDescription(
            "Delete messages that were sent after a specific message (ID/Link)",
          )
          .addStringOption((option) =>
            option
              .setName("message")
              .setDescription("Message ID/Link to delete messages after")
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("embeds")
          .setDescription("Delete messages which contain embeds")
          .addIntegerOption((option) =>
            option
              .setName("count")
              .setDescription("Number of messages to delete. Limit 100")
              .setMaxValue(100)
              .setMinValue(1)
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("files")
          .setDescription("Delete messages which contain files")
          .addIntegerOption((option) =>
            option
              .setName("count")
              .setDescription("Number of messages to delete. Limit 100")
              .setMaxValue(100)
              .setMinValue(1)
              .setRequired(true),
          ),
      )
      .addSubcommand((option) =>
        option
          .setName("commands")
          .setDescription("Delete messages which are Slash Commands")
          .addIntegerOption((option) =>
            option
              .setName("count")
              .setDescription("Number of messages to delete. Limit 100")
              .setMaxValue(100)
              .setMinValue(1)
              .setRequired(true),
          ),
      ),
    usage: "",
    ephemeral: true,
    global: true,
    disabled: true,
    execute: (client, interaction, data) => {},
  },
};
