const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("⏰ Remove timeout from a member.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to untimeout.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for the the untimeout.")
                .setRequired(false),
        ),
    category: "moderation",
    usage: "/untimeout",
    botPermissions: ["ModerateMembers"],
    userPermissions: ["ModerateMembers"],
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        const member = interaction.options.getMember("member");
        const reason = interaction.options.getString("reason");

        const errorsArray = [];
        const errorEmbed = new EmbedBuilder()
            .setAuthor({
                name: "Could not untimeout member due to",
            })
            .setColor(client.colors.americanRose);

        if (!member) {
            return interaction.followUp({
                embeds: [
                    errorEmbed.setDescription("Member has most likely left the server."),
                ],
                ephemeral: true,
            });
        }

        if (!member.moderatable || !member.manageable) {
            errorsArray.push("Selected member is not moderatable by this bot.");
        }

        if (interaction.member.roles.highest.position < member.roles.highest.position) {
            errorsArray.push("Selected member has a higher role position than you.");
        }

        if (errorsArray.length) {
            return interaction.followUp({
                embeds: [errorEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true,
            });
        }

        await member.timeout(10000, reason);
        let content;

        if (reason) {
            content = `**✅ @${member.user.username} has been untimed out for ${reason}**`;
        } else {
            content = `**✅ @${member.user.username} has been untimed out!**`;
        }

        return interaction.reply({
            content: content,
        });
    },
};
