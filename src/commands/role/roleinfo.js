const {
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");
const date = new Date();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roleinfo")
        .setDescription("📖 View any role's information.")
        .setDMPermission(false)
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("Select a role.")
                .setRequired(true),
        ),
    category: "role",
    usage: "/info role",
    userPermissions: [],
    botPermissions: [],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (client, interaction) => {
        const role = (await interaction.guild.roles.fetch()).get(
            interaction.options.getRole("role").id,
        );
        const embed = new EmbedBuilder()
            .setTitle("ROLE INFORMATION")
            .setColor(role.hexColor)
            .setThumbnail(role.icon ? role.iconURL() : null)
            .addFields(
                {
                    name: "Name",
                    value: `\`\`\`\n${role.name}\`\`\``,
                    inline: true,
                },
                {
                    name: "ID",
                    value: `\`\`\`\n${role.id}\`\`\``,
                    inline: true,
                },
                {
                    name: `Position (from top)`,
                    value: `\`\`\`m\n${
                        interaction.guild.roles.cache.size - role.position
                    }\`\`\``,
                    inline: true,
                },
                {
                    name: "Color Code",
                    value: `\`\`\`\n${role.hexColor}\`\`\``,
                    inline: true,
                },
                {
                    name: "Mentionable",
                    value: `\`\`\`\n${role.mentionable ? "Yes" : "No"}\n\`\`\``,
                    inline: true,
                },
                {
                    name: "Hoisted",
                    value: `\`\`\`\n${role.hoist ? "Yes" : "No"}\n\`\`\``,
                    inline: true,
                },
                {
                    name: "Bot Role",
                    value: `\`\`\`\n${role.managed ? "Yes" : "No"}\n\`\`\``,
                    inline: true,
                },
                {
                    name: "Created On",
                    value: `\`\`\`\n${moment(role.createdTimestamp).format("")})\`\`\``,
                },
            )
            .setFooter({
                text: `Powered by ${client.user.username}`,
            });

        return interaction.reply({
            embeds: [embed],
        });
    },
};
