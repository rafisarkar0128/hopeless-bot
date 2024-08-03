// variables
const { Client, Message, EmbedBuilder } = require("discord.js");

// exporting the code
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
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTitle("Did you just mention my me?")
            .setDescription(
                [
                    `Hello <@${message.author.id}>!`,
                    `I am <@${client.user.id}>, a bot developed by **theassassin0128** for the purpose of manage and maintain this server. For more information or any kind of help regarding the bot by use **\`/help\`** command.`,
                ].join("\n")
            )
            .setColor(client.colors.powderBlue)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp();

        if (message.author.bot) return;

        if (message.content.match(prefixMention)) {
            return message.reply({
                embeds: [embed],
            });
        } else return;
    },
};
