const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("⏰ Restrict a member's ability to communicate.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("The member to timeout.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("duration")
                .setDescription("Duration of the timeout.")
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("Reason for the the timeout.")
                .setRequired(false),
        ),
    aliases: [],
    minArgsCount: 0,
    usage: "/timeout [options] | {prefix}timeout [options]",
    cooldown: 0,
    category: "MODERATION",
    premium: false,
    disabled: { slash: false, prefix: false },
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: ["ModerateMembers"],
    userPermissions: ["ModerateMembers"],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {
        const member = interaction.options.getMember("member");
        const duration = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason");

        const errorsArray = [];
        const errorEmbed = new EmbedBuilder()
            .setAuthor({
                name: "Could not timeout member due to",
            })
            .setColor(client.colors.americanRose);

        if (!member) {
            return interaction.followUp({
                embeds: [
                    errorEmbed.setDescription("Member has most likely left the server."),
                ],
                ephemeral: true,
            });
        }
        if (!ms(duration) || ms(duration) > ms("28d")) {
            errorsArray.push("The provided time is invalid or over the 28 days limit.");
        }
        if (!member.moderatable || !member.manageable) {
            errorsArray.push("Selected member is not moderatable by this bot.");
        }
        if (interaction.member.roles.highest.position < member.roles.highest.position) {
            errorsArray.push("Selected member has a higher role position than you.");
        }
        if (errorsArray.length) {
            return interaction.followUp({
                embeds: [errorEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true,
            });
        }

        await member.timeout(ms(duration), reason);

        if (reason) {
            return interaction.reply({
                content: `**✅ @${member.user.username} has been timed out for ${reason}**`,
            });
        } else {
            return interaction.reply({
                content: `**✅ @${member.user.username} has been timed out!**`,
            });
        }
    },
};
