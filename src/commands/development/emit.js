const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
    ChatInputCommandInteraction,
} = require("discord.js");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Emit an Event")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild | PermissionFlagsBits.Administrator,
        )
        .addStringOption((option) =>
            option
                .setName("event")
                .setDescription("The event to emit")
                .setRequired(true)
                .setChoices(
                    {
                        name: "guildMemberAdd",
                        value: "add",
                    },
                    {
                        name: "guildMemberRemove",
                        value: "remove",
                    },
                ),
        )
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Select a member.")
                .setRequired(false),
        ),
    aliases: [],
    minArgsCount: 0,
    usage: "",
    cooldown: 0,
    category: "DEVELOPMENT",
    premium: false,
    disabled: { slash: false, prefix: false },
    global: true,
    guildOnly: true,
    devOnly: false,
    botPermissions: ["ManageGuild"],
    userPermissions: ["ManageGuild"],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {
        const member = interaction.options.getMember("member") || interaction.member;
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
                        content: "Emitted Guild Member Remove event successfully.",
                        ephemeral: true,
                    });
                }
                break;
            default:
                break;
        }
    },
};
