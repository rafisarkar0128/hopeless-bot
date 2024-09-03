const {
    Client,
    SlashCommandBuilder,
    EmbedBuilder,
    version,
    ChatInputCommandInteraction,
    AttachmentBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");
const pkg = require(`${process.cwd()}/package.json`);
const { profileImage } = require("discord-arts");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("📖 View bot's information.")
        .setDMPermission(true),
    category: "misc",
    usage: "/botinfo",
    userPermissions: [],
    botPermissions: [],
    cooldown: 60,
    devOnly: true,
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns
     */
    execute: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const days = Math.floor(client.uptime / 86400000);
            const hours = Math.floor(client.uptime / 3600000) % 24;
            const minutes = Math.floor(client.uptime / 60000) % 60;
            const seconds = Math.floor(client.uptime / 1000) % 60;

            const reply = await interaction.fetchReply();

            const wsPing = client.ws.ping;
            const apiPing =
                reply.createdTimestamp - interaction.createdTimestamp;

            const profileBuffer = await profileImage(client.user.id, {
                usernameColor: client.colors.powderBlue,
                presenceStatus: client.user.presence.status,
                borderColor: client.colors.powderBlue,
            });
            const imageAttachment = new AttachmentBuilder(profileBuffer, {
                name: "profile.png",
            });

            const member = await interaction.guild.members.fetch(
                client.user.id
            );

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.displayName,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setColor(member.displayHexColor || client.colors.americanRose)
                .setTitle(`${client.user.tag}'s Information`)
                .setDescription(
                    [
                        `**Tag:** ${client.user.tag}`,
                        `**Version:** ${pkg.version}`,
                        `**Website:** Coming soon.`,
                    ].join("\n")
                )
                .setThumbnail(client.user.avatarURL())
                .setImage("attachment://profile.png")
                .addFields(
                    {
                        name: `📡 WS Ping`,
                        value: `\`\`\`yml\n${
                            wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"
                        } ${wsPing}ms\`\`\``,
                        inline: true,
                    },
                    {
                        name: `🛰 API Ping`,
                        value: `\`\`\`yml\n${
                            apiPing <= 200 ? "🟢" : apiPing <= 400 ? "🟡" : "🔴"
                        } ${apiPing}ms\`\`\``,
                        inline: true,
                    },
                    {
                        name: `⏲ Uptime`,
                        value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\`\`\``,
                        inline: false,
                    },
                    {
                        name: "LANGUAGE & LIBRARY",
                        value: [
                            `**Name :** [nodejs](https://nodejs.org/en/)`,
                            `**Library :** [discord.js](https://discord.js.org/#/)`,
                            `**Version :** ${version}`,
                        ].join("\n"),
                        inline: true,
                    },
                    {
                        name: "SOURCE CODE",
                        value: `Repository is available on github`,
                        inline: true,
                    }
                )
                .setFooter({
                    text: `Powered by ${client.user.username}`,
                });

            const githubButton = new ButtonBuilder()
                .setLabel("GitHub")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    "https://github.com/theassassin0128/Hopeless-Bot#readme"
                );

            const discordButton = new ButtonBuilder()
                .setLabel("Support")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/E6H9VvBdTk");

            const inviteButton = new ButtonBuilder()
                .setLabel("Invite Me")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    "https://discord.com/oauth2/authorize?client_id=1272259032098275358"
                );

            const websiteButton = new ButtonBuilder()
                .setLabel("Website")
                .setStyle(ButtonStyle.Link)
                .setURL("https://theassassin0128.github.io/Hopeless-Bot");

            const actionRow = new ActionRowBuilder()
                .addComponents(githubButton)
                .addComponents(discordButton)
                .addComponents(inviteButton)
                .addComponents(websiteButton);

            return interaction.editReply({
                embeds: [embed],
                components: [actionRow],
                files: [imageAttachment],
            });
        } catch (error) {
            throw error;
        }
    },
};
