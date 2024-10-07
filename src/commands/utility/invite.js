const {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    resolvePartialEmoji,
    OAuth2Scopes,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("returns a link button with bots invite url."),
    aliases: ["invt"],
    usage: "{prefix}invite | /invite",
    cooldown: 0,
    category: "UTILITY",
    disabled: false,
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    run: (client, message) => {
        const inviteLink = client.generateInvite({
            permissions: BigInt(630567770521207),
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        });
        const button = new ButtonBuilder()
            .setLabel("Invite Link")
            .setStyle(ButtonStyle.Link)
            .setURL(inviteLink)
            .setEmoji(resolvePartialEmoji("✉️"));

        return message.reply({
            content: "Invite me by clicking the button.",
            ephemeral: false,
            components: [new ActionRowBuilder().addComponents(button)],
        });
    },
    execute: (client, interaction) => {
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
