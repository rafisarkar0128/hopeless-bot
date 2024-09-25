const {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    resolvePartialEmoji,
    OAuth2Scopes,
} = require("discord.js");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("returns a link button with bots invite url."),
    aliases: ["invt"],
    minArgsCount: 0,
    usage: "{prefix}invite | /invite",
    cooldown: 0,
    category: "UTILITY",
    premium: false,
    disabled: true,
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    run: (client, message, args, data) => {
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
    execute: (client, interaction, data) => {
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
