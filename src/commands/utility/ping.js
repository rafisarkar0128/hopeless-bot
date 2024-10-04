const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓Pong! Replies with an embed containing ping information."),
    aliases: [],
    minArgsCount: 0,
    usage: "/ping | {prefix}ping",
    cooldown: 0,
    category: "UTILITY",
    premium: false,
    disabled: { slash: false, prefix: false },
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    run: async (client, message, args, data) => {
        const reply = await message.reply({
            content: "Wait a moment for the embed.",
        });

        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;

        const clientPing = reply.createdTimestamp - message.createdTimestamp;
        const wsPing = client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle("MY RUNTIME STATS")
            .setColor(client.utils.getRandomColor())
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: `📡 WS Ping`,
                    value: `\`\`\`yml\n${
                        wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"
                    } ${wsPing}ms\`\`\``,
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

        return reply.edit({
            content: "",
            embeds: [embed],
        });
    },
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
                    value: `\`\`\`yml\n${
                        wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"
                    } ${wsPing}ms\`\`\``,
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
