const {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    resolvePartialEmoji,
    Client,
    ChatInputCommandInteraction,
    OAuth2Scopes,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("returns a link button with bots invite url.")
        .setDMPermission(true),
    category: "util",
    usage: "/invite",
    userPermissions: [],
    botPermissions: [],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (client, interaction) => {
        try {
            const inviteLink = client.generateInvite({
                permissions: BigInt(1539745246838),
                scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            });
            const button = new ButtonBuilder()
                .setLabel("Invite Link")
                .setStyle(ButtonStyle.Link)
                .setURL(inviteLink)
                .setEmoji(resolvePartialEmoji("✉️"));

            return interaction.reply({
                content: "Invite me by clicking the button.",
                ephemeral: false,
                components: [new ActionRowBuilder().addComponents(button)],
            });
        } catch (error) {
            throw error;
        }
    },
};
