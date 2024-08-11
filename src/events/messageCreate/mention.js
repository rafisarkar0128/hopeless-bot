const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageCreate",
    once: false,
    rest: false,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @returns
     */
    execute: async (client, message) => {
        const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        const embed = new EmbedBuilder()
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTitle("Did you just mention my me?")
            .setDescription(
                `I am ${client.user.username}, a bot developed by **theassassin0128** to manage this server. For more information or help use **\`/help\`**.`
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.colors.main)
            .setFooter({
                text: `Powered by ${client.user.username}`,
            });

        if (message.author.bot) return;
        if (!message.content.match(prefixMention)) return;
        return message.reply({
            embeds: [embed],
        });
    },
};
