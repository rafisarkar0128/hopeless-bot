// ContextMenu Structure

const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

/** @type {import("@types/commands").ContextMenuStructure} */
module.exports = {
    data: new ContextMenuCommandBuilder().setType(
        ApplicationCommandType.User || ApplicationCommandType.User, // Either User or Message not both
    ),
    cooldown: 0,
    category: "NONE",
    premium: false,
    disabled: false,
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    execute: async (client, interaction, data) => { },
};
