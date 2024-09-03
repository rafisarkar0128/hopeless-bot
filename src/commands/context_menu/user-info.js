const {
    Client,
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction,
    ApplicationCommandType,
} = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("User Information")
        .setDMPermission(true)
        .setType(ApplicationCommandType.User),
    category: "context_menu",
    //usage: "/ping",
    userPermissions: [],
    botPermissions: [],
    toggleOff: true,
    /**
     *
     * @param {Client} client
     * @param {UserContextMenuCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        interaction.reply({
            content: "Still in development.",
        });
    },
};
