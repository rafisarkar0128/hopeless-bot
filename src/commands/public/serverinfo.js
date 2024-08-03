// variables
const {
    EmbedBuilder,
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
} = require("discord.js");
const moment = require("moment");

// exporting the module
module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Replies with server information.")
        .setDMPermission(false),
    category: "util",
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (client, interaction) => {
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
                    value: `${moment(interaction.guild.createdAt).format(
                        "dddd, MMMM Do YYYY, h:mm:ss A"
                    )}\n - ${moment(interaction.guild.createdAt, "YYYYMMDD").fromNow()}`,
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
    },
};
