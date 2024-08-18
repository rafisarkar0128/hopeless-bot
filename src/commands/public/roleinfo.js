const {
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");
const moment = require("moment");

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
    category: "public",
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
            interaction.options.getRole("role").id
        );
        const embed = new EmbedBuilder()
            .setTitle("Role Information")
            .setColor(role.hexColor)
            .setThumbnail(role.icon ? role.iconURL() : null)
            .addFields(
                {
                    name: "Name",
                    value: `\`\`\`js\n${role.name}\`\`\``,
                    inline: true,
                },
                {
                    name: "ID",
                    value: `\`\`\`yml\n${role.id}\`\`\``,
                    inline: true,
                },
                {
                    name: "Created On",
                    value: `\`\`\`yml\n${moment(role.createdAt).format(
                        "dddd, MMMM Do YYYY, h:mm:ss A"
                    )}\n- ${moment(
                        role.createdAt,
                        "YYYYMMDD"
                    ).fromNow()}\`\`\``,
                },
                {
                    name: `Members`,
                    value: `\`\`\`yml\n${role.members.size}\`\`\``,
                    inline: true,
                },
                {
                    name: `Position (from top)`,
                    value: `\`\`\`yml\n${
                        interaction.guild.roles.cache.size - role.position
                    }\`\`\``,
                    inline: true,
                },
                {
                    name: "Color Code",
                    value: `\`\`\`css\n${role.hexColor}\`\`\``,
                    inline: true,
                },
                {
                    name: "Mentionable",
                    value: `\`\`\`yml\n${
                        role.mentionable ? "Yes" : "No"
                    }\n\`\`\``,
                    inline: true,
                },
                {
                    name: "Hoisted",
                    value: `\`\`\`yml\n${role.hoist ? "Yes" : "No"}\n\`\`\``,
                    inline: true,
                },
                {
                    name: "Bot Role",
                    value: `\`\`\`yml\n${role.managed ? "Yes" : "No"}\n\`\`\``,
                    inline: true,
                }
            )
            .setFooter({
                text: `Powered by ${client.user.username}`,
            });

        return interaction.reply({
            embeds: [embed],
        });
    },
};
