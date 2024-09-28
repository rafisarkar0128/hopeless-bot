const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    InteractionContextType,
} = require("discord.js");

/** @type {import("@src/index").ContextMenuStructure} */
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
    premium: false,
    disabled: { slash: false, prefix: false },
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    execute: async (client, interaction, data) => {
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

