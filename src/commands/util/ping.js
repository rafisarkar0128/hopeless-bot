// variables
const {
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");

// exporting the module
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓Replies with an embed containing information.")
        .setDMPermission(true),
    category: "util",
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        await interaction.deferReply();

        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;
        const wsPing = client.ws.ping;
        const reply = await interaction.fetchReply();
        const apiPing = reply.createdTimestamp - interaction.createdTimestamp;
        const embed = new EmbedBuilder()
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTitle("MY RUNTIME STATS")
            .setColor(
                wsPing <= 400
                    ? client.colors.androidGreen
                    : wsPing <= 800
                      ? "Yellow"
                      : client.colors.americanRose
            )
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: `📡 WS Ping`,
                    value: `>>> \`\`\`yml\n${
                        wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"
                    } ${wsPing}ms\`\`\``,
                    inline: true,
                },
                {
                    name: `🛰 API Ping`,
                    value: `>>> \`\`\`yml\n${
                        apiPing <= 200 ? "🟢" : apiPing <= 400 ? "🟡" : "🔴"
                    } ${apiPing}ms\`\`\``,
                    inline: true,
                },
                {
                    name: `⏲ Uptime`,
                    value: `>>> \`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\`\`\``,
                    inline: false,
                },
            ])
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        return interaction.editReply({
            embeds: [embed],
        });
    },
};
