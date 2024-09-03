const {
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
    ChannelType,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("errorlog")
        .setDescription("Error messages logging system.")
        .setDMPermission(false)
        .addSubcommand((option) =>
            option
                .setName("setup")
                .setDescription("Setup the error messages logging system.")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "Select a channel to recieve error messages."
                        )
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("toggle")
                .setDescription("Toggle the error messages logging system.")
        )
        .addSubcommand((option) =>
            option
                .setName("delete")
                .setDescription("Remove the error messages logging system.")
        )
        .addSubcommand((option) =>
            option
                .setName("info")
                .setDescription(
                    "Get info about the error messages logging system."
                )
        ),
    category: "util",
    usage: "/error [Sub Command]",
    userPermissions: [],
    botPermissions: [],
    devOnly: true,
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {},
};
