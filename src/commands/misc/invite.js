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
    category: "misc",
    usage: "/invite",
    userPermissions: [],
    botPermissions: [],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (client, interaction) => {
        const inviteLink = client.generateInvite({
            permissions: BigInt(630567770521207),
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
    },
};
