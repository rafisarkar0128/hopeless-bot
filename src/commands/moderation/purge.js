// variables
const {
    SlashCommandBuilder,
    Client,
    PermissionFlagsBits,
    ChatInputCommandInteraction,
} = require("discord.js");

// exporting the module
module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("🧹 Purge a certain amount of messages.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("Number of messages to delete.")
                .setMaxValue(100)
                .setMinValue(1)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Select a member.")
                .setRequired(false)
        ),
    category: "moderation",
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (client, interaction) => {
        const amount = interaction.options.getInteger("amount");
        const member = interaction.options.getMember("member");

        if (member) {
            const fetchMessages = await interaction.channel.messages.fetch();
            let i = 0;
            let messagesToDelete = [];
            fetchMessages.filter((message) => {
                if (message.author.id == member.id && amount > i) {
                    return messagesToDelete.push(message) && i++;
                }
            });
            const dMessages = await interaction.channel.bulkDelete(
                messagesToDelete,
                true
            );

            return interaction.reply({
                content: `Deleted \`${dMessages.size}\` messages of ${member}`,
                ephemeral: true,
            });
        } else {
            const dMessages = await interaction.channel.bulkDelete(
                amount,
                true
            );

            return interaction.reply({
                content: `Deleted \`${dMessages.size}\` messages in ${interaction.channel}.`,
                ephemeral: true,
            });
        }
    },
};
