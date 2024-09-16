const { ChatInputCommandInteraction } = require("discord.js");
const {
    SlashCommandBuilder,
    InteractionContextType,
    PermissionFlagsBits,
} = require("discord.js");

/**
 * @type {import("../../structures/CommandStructure.js")}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("testing Stuff")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setNSFW(false)
        .setContexts(
            InteractionContextType.BotDM,
            InteractionContextType.Guild,
            InteractionContextType.PrivateChannel
        ),
    aliases: ["te", "est", "tt"],
    usage: "h!test | /test",
    minArgsCount: 0,
    subcommands: [],

    cooldown: 0,
    category: "TEST",
    premium: false,

    botPermissions: [],
    userPermissions: ["Administrator"],

    enabled: true,
    server: true,

    run: (client, message, args, ...optional) => {},
    execute: (client, interaction, data, ...optonal) => {},

    run: (client, message, args, ...optional) => {},
    /**
     *
     * @param {import("../../structures/DiscordBot.js").DiscordBot} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {Object} data
     * @param  {...any} optonal
     */
    execute: (client, interaction, data, ...optonal) => {
        interaction.reply({
            content: `Current commands collection size: ${client.commands.size}`,
        });
    },
};
