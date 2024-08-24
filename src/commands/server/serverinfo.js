const {
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");
const { DateTime } = require("luxon");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("📖 View the server information.")
        .setDMPermission(false),
    category: "server",
    usage: "/info member",
    userPermissions: [],
    botPermissions: [],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (client, interaction) => {
        try {
            const Roles = interaction.guild.roles.cache;
            const owner = (await interaction.guild.members.fetch()).get(
                interaction.guild.ownerId
            );
            const Channels = await interaction.guild.channels.fetch();

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL(),
                })
                .setTitle(`${interaction.guild.name}`)
                .addFields(
                    {
                        name: "🆔 ID",
                        value: `${interaction.guild.id}`,
                    },
                    {
                        name: "📅 Created On",
                        value: `${DateTime.fromMillis(
                            interaction.guild.createdTimestamp
                        ).toFormat(
                            "cccc, dd LLLL yyyy, h:mm:ss a"
                        )}\n - ${DateTime.fromMillis(
                            interaction.guild.createdTimestamp
                        ).toRelative("YYYYMMDD")}`,
                    },
                    {
                        name: "👑 Owned by",
                        value: `${owner} (${owner.id})`,
                    },
                    {
                        name: `👥 Members [${interaction.guild.memberCount}]`,
                        value: "More information will be added in future Updates.",
                    },
                    {
                        name: `💬 Channels [${Channels.size}]`,
                        value: "More information will be added in the future updates.",
                    },
                    {
                        name: `🔐 Roles [${Roles.size}]`,
                        value: "Use `/roles` to get a list of roles",
                    }
                )
                .setColor(client.colors.powderBlue)
                .setThumbnail(interaction.guild.iconURL({ size: 4096 }))
                .setFooter({
                    text: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL(),
                });

            return interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            throw error;
        }
    },
};
