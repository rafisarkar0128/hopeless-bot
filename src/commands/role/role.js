const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
    Client,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Give | Remove role(s) from server members")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand((option) =>
            option
                .setName("give")
                .setDescription("Gives a role to a user.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to give.")
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName("target")
                        .setDescription("The user to give the role.")
                        .setRequired(true)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("remove")
                .setDescription("Removes a role from a user.")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to remove.")
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName("target")
                        .setDescription("The user to remove the role.")
                        .setRequired(true)
                )
        )
        .addSubcommand((option) =>
            option
                .setName("multiple")
                .setDescription("Role command for multiple users.")
                .addStringOption((option) =>
                    option
                        .setName("action")
                        .setDescription("Pick an action")
                        .setRequired(true)
                        .addChoices(
                            { name: "Give", value: "give" },
                            { name: "Remove", value: "remove" }
                        )
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription("The role to gives.")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Pick a type")
                        .setRequired(true)
                        .addChoices(
                            { name: "All Members", value: "all" },
                            { name: "Humans", value: "humans" },
                            { name: "Bots", value: "bots" }
                        )
                )
        ),
    category: "role",
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (interaction, client) => {},
};
