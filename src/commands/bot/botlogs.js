const { SlashCommandBuilder } = require("discord.js");

/**
 * @type {import("@src/index").CommandStructure}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("botlogs")
        .setDescription("Setup logs for the bot."),
    aliases: ["blogs", "blog", "botl", "bl"],
    minArgsCount: 0,
    usage: "{prefix}botlogs | /botlogs",
    cooldown: 25,
    category: "OWNER",
    premium: false,
    botPermissions: [],
    userPermissions: [],
    run: async (client, message, args, data) => {
        return await message.reply({
            content: "**Still in development.**",
        });
    },
    execute: async (client, interaction, data) => {
        return await interaction.reply({
            content: "**Still in development.**",
            ephemeral: true,
        });
    },
};
