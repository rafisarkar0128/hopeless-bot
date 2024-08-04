// variables
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
    ChatInputCommandInteraction,
} = require("discord.js");

// exporting the module
module.exports = {
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Emit an Event")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("event")
                .setDescription("The event to emit")
                .setRequired(true)
                .setChoices(
                    {
                        name: "guildMemeberAdd",
                        value: "add",
                    },
                    {
                        name: "guildMemberRemove",
                        value: "remove",
                    }
                )
        )
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Select a member.")
                .setRequired(false)
        ),
    category: "development",
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        const member =
            interaction.options.getMember("member") || interaction.member;
        const string = interaction.options.getString("event");

        switch (string) {
            case "add":
                {
                    client.emit("guildMemberAdd", member);

                    interaction.reply({
                        content: "Emitted Guild Member Add event successfully.",
                        ephemeral: true,
                    });
                }
                break;
            case "remove":
                {
                    client.emit("guildMemberRemove", member);

                    interaction.reply({
                        content:
                            "Emitted Guild Member Remove event successfully.",
                        ephemeral: true,
                    });
                }
                break;
            default:
                break;
        }
    },
};
