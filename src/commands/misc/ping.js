const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/**
 * @type {import("../../structures/CommandStructure.js")}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓Replies with an embed containing information."),

    options: {
        aliases: [],
        minArgsCount: 0,
        subcommands: [],
    },
    usage: "/ping | {prefix}ping",
    cooldown: 0,
    category: "INFORMATION",
    premium: false,
    botPermissions: ["SendMessages"],
    userPermissions: ["SendMessages"],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {
        const reply = await interaction.deferReply({
            fetchReply: true,
        });

        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;

        const clientPing = reply.createdTimestamp - interaction.createdTimestamp;
        const wsPing = client.ws.ping;
        const totalPing = wsPing + clientPing;

        const embed = new EmbedBuilder()
            .setTitle("MY RUNTIME STATS")
            .setColor(
                client.colors.array[
                    Math.floor(Math.random() * client.colors.array.length)
                ],
            )
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: `📡 WS Ping`,
                    value: `\`\`\`yml\n${wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"} ${wsPing}ms\`\`\``,
                    inline: true,
                },
                {
                    name: `🛰 BOT Ping`,
                    value: `\`\`\`yml\n${
                        clientPing <= 200 ? "🟢" : clientPing <= 400 ? "🟡" : "🔴"
                    } ${clientPing}ms\`\`\``,
                    inline: true,
                },
                {
                    name: `⏲ Uptime`,
                    value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\n\`\`\``,
                    inline: false,
                },
            ])
            .setFooter({
                text: client.config.bot.footer,
            });

        return interaction.followUp({
            embeds: [embed],
        });
    },
};
