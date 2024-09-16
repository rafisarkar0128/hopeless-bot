const {
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Get the role list of a server.")
        .setDMPermission(false),
    category: "role",
    usage: "/roles",
    userPermissions: [],
    botPermissions: [],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (client, interaction) => {
        await interaction.deferReply();

        const roles = interaction.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map((r) => `<@&${r.id}>`);
        const embed = new EmbedBuilder().setColor(
            client.colors.array[
                Math.floor(Math.random() * client.colors.array.length)
            ]
        );
        const roleEmbeds = [];

        if (roles.slice(0, 50)?.length) {
            embed.setDescription(`${roles.slice(0, 50).join("\n")}`);
            roleEmbeds.push(embed.toJSON());
        }
        if (roles.slice(50, 100).length) {
            embed.setDescription(`${roles.slice(50, 100).join("\n")}`);
            roleEmbeds.push(embed.toJSON());
        }
        if (roles.slice(100, 150).length) {
            embed.setDescription(`${roles.slice(100, 150).join("\n")}`);
            roleEmbeds.push(embed.toJSON());
        }
        if (roles.slice(150, 200).length) {
            embed.setDescription(`${roles.slice(150, 200).join("\n")}`);
            roleEmbeds.push(embed.toJSON());
        }
        if (roles.slice(200, 250).length) {
            embed.setDescription(`${roles.slice(200, 250).join("\n")}`);
            roleEmbeds.push(embed.toJSON());
        }

        return interaction.followUp({
            embeds: roleEmbeds.length ? roleEmbeds : [],
        });
    },
};
