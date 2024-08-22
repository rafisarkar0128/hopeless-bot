const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");
const errorlog = require("../../../schemas/errorlog.js");

module.exports = {
    name: "errorlog.info",
    subCommand: true,
    category: "system",
    usage: "/errorlog info",
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        const doc = await errorlog.findOne({
            guild: interaction.guild.id,
        });

        if (!doc) {
            return interaction.reply({
                content: ` Error Logging System is disabled for this server.`,
                ephemeral: true,
            });
        }

        const guild = await client.guilds.fetch(doc.guild);
        const channel = await guild.channels.fetch(`${doc.channel}`);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle("Error Message Logging System Info")
            .setThumbnail(client.user.avatarURL())
            .setFields(
                {
                    name: "Server",
                    value: [
                        `\`\`\`js`,
                        `{`,
                        `  name: ${guild.name}`,
                        `  id: ${guild.id}`,
                        `}`,
                        `\`\`\``,
                    ].join("\n"),
                    inline: false,
                },
                {
                    name: "Channel",
                    value: [
                        `\`\`\`js`,
                        `{`,
                        `  name: ${channel.name}`,
                        `  id: ${channel.id}`,
                        `}`,
                        `\`\`\``,
                    ].join("\n"),
                    inline: false,
                },
                {
                    name: "Enabled",
                    value: [`\`\`\`js`, `${doc.enabled}`, `\`\`\``].join("\n"),
                    inline: false,
                }
            )
            .setColor(client.colors.azure)
            .setFooter({
                text: `Powered by ${client.user.username}`,
            });

        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
