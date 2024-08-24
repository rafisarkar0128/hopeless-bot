const {
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");
const { DateTime } = require("luxon");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roleinfo")
        .setDescription("📖 View any role's information.")
        .setDMPermission(false)
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("Select a role.")
                .setRequired(true)
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
        try {
            const role = (await interaction.guild.roles.fetch()).get(
                interaction.options.getRole("role").id
            );
            const embed = new EmbedBuilder()
                .setTitle("Role Information")
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
                        value: `\`\`\`m\n${role.id}\`\`\``,
                        inline: true,
                    },
                    {
                        name: "Created On",
                        value: `\`\`\`m\n${DateTime.fromMillis(
                            role.createdTimestamp
                        ).toFormat(
                            "cccc, MMMM dd yyyy, h:mm:ss a"
                        )}\n- ${DateTime.fromMillis(
                            role.createdTimestamp,
                            "YYYYMMDD"
                        ).toRelativeCalendar()}\`\`\``,
                    },
                    {
                        name: `Members`,
                        value: `\`\`\`m\n${role.members.size}\`\`\``,
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
                        value: `\`\`\`\n${
                            role.mentionable ? "Yes" : "No"
                        }\n\`\`\``,
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
                    }
                )
                .setFooter({
                    text: `Powered by ${client.user.username}`,
                });

            return interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            throw error;
        }
    },
};
