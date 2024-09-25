const {
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");
const { DateTime } = require("luxon");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("roleinfo")
        .setDescription("📖 View any role's information.")
        .addRoleOption((option) =>
            option.setName("role").setDescription("Select a role.").setRequired(true),
        ),
    aliases: [],
    minArgsCount: 0,
    usage: "/roleinfo [role] | {prefix}roleinfo [role]",
    cooldown: 0,
    category: "INFORMATION",
    premium: false,
    disabled: false,
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {
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
                    value: `\`\`\`\n${DateTime.fromMillis(role.createdTimestamp).toFormat(
                        "dd/LL/yy, h:mm:ss a",
                    )} (${DateTime.fromMillis(
                        role.createdTimestamp,
                    ).toRelativeCalendar()})\n\`\`\``,
                    inline: false,
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
