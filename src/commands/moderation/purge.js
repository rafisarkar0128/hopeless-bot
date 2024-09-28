const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("🧹 Delete bulk amount of messages.")
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
    aliases: [],
    minArgsCount: 0,
    usage: "/purge [Sub Command] | {prefix}purge [subcommand]",
    cooldown: 0,
    category: "MODERATION",
    premium: false,
    disabled: { slash: false, prefix: true },
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: ["ManageMessages"],
    userPermissions: ["ManageMessages"],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {},
};
