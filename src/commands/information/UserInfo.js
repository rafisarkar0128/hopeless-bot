const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    InteractionContextType,
} = require("discord.js");

/** @type {import("@types/commands").ContextMenuStructure} */
module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("User Information")
        .setType(ApplicationCommandType.User)
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
        ]),
    cooldown: 0,
    category: "INFORMATION",
    disabled: false,
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    execute: async (client, interaction) => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("**Still in Development**")
                    .setColor(client.colors.Normal),
            ],
            ephemeral: true,
        });
    },
};
