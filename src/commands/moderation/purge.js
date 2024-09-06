const {
  SlashCommandBuilder,
  Client,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("🧹 Delete bulk amount of messages.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((option) =>
      option
        .setName("bots")
        .setDescription("Delete messages that were sent by bots.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages to delete. Limit 100.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName("any")
        .setDescription("Delete messages of any type.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages to delete. Limit 100.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName("user")
        .setDescription("Delete messages that were sent by a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select a user to delete messages.")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages to delete. Limit 100.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName("after")
        .setDescription(
          "Delete messages that were sent after a specific message.(ID/Link)",
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
        .setDescription("Delete messages which contain embeds.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages to delete. Limit 100.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName("files")
        .setDescription("Delete messages which contain embeds.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages to delete. Limit 100.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName("commands")
        .setDescription("Delete messages which are Slash Commands.")
        .addIntegerOption((option) =>
          option
            .setName("count")
            .setDescription("Number of messages to delete. Limit 100.")
            .setMaxValue(100)
            .setMinValue(1)
            .setRequired(true),
        ),
    ),
  category: "moderation",
  usage: "/purge [Sub Command]",
  botPermissions: ["ManageMessages"],
  userPermissions: ["ManageMessages"],
  cooldown: 20,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute: async (client, interaction) => {},
};
