const {
    Message,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");

/**
 * @type {import("@src/index").EventStructure}
 */
module.exports = {
    name: "messageCreate",
    once: false,
    rest: false,
    execute: async (client, message) => {
        if (message.author.bot) return;

        const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (!message.content.match(prefixMention)) return;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTitle("Did you just mention me?")
            .setDescription(
                `I am ${client.user.username}, a bot developed by **<@${client.config.ownerId}>** to manage this server. For help use **\`/help\`**. For more information visit my website.`,
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.utils.getRandomColor())
            .setFooter({
                text: client.config.bot.footer,
            });

        const githubButton = new ButtonBuilder()
            .setLabel("GitHub")
            .setStyle(ButtonStyle.Link)
            .setURL("https://github.com/theassassin0128/Hopeless-Bot#readme");

        const discordButton = new ButtonBuilder()
            .setLabel("Support")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/E6H9VvBdTk");

        const inviteButton = new ButtonBuilder()
            .setLabel("Invite Me")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/oauth2/authorize?client_id=1272259032098275358");

        const websiteButton = new ButtonBuilder()
            .setLabel("Website")
            .setStyle(ButtonStyle.Link)
            .setURL("https://theassassin0128.github.io/Hopeless-Bot");

        const actionRow = new ActionRowBuilder()
            .addComponents(githubButton)
            .addComponents(discordButton)
            .addComponents(inviteButton)
            .addComponents(websiteButton);

        return message.reply({
            embeds: [embed],
            components: [actionRow],
        });
    },
};
