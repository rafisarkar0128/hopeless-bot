// variables
const {
    EmbedBuilder,
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
} = require("discord.js");
const moment = require("moment");
const { category } = require("../moderation/purge");

// exporting the module
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roleinfo")
        .setDescription("View any role's information")
        .setDMPermission(false)
        .addRoleOption((options) =>
            options.setName("role").setDescription("The role").setRequired(true)
        ),
    category: "public",
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
            .setAuthor({
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            })
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
                    value: `\`\`\`\n${moment(role.createdAt).format(
                        "dddd, MMMM Do YYYY, h:mm:ss A"
                    )}\n - ${moment(
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
                    value: `\`\`\`yml\n${role.hexColor}\`\`\``,
                    inline: true,
                },
                {
                    name: "EXTRA",
                    value: [
                        `\`\`\`yml`,
                        `Mentionable : ${role.mentionable}`,
                        `Separated   : ${role.hoist}`,
                        `Integration : ${role.managed}`,
                        `\`\`\``,
                    ].join("\n"),
                }
            )
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
        });
    },
};
