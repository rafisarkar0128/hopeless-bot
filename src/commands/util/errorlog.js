const {
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");
const errorlog = require("../../schemas/errorlog.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("errorlog")
        .setDescription("Error messages logging system.")
        .setDMPermission(false)
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Select a channel to log error messages.")
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
        ),
    category: "util",
    usage: "/errorlog (Channel)",
    userPermissions: [],
    botPermissions: [],
    devOnly: true,
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel");
        const doc = await errorlog.findOne({
            Enabled: "true",
        });

        if (!channel && !doc) {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.Wrong)
                        .setDescription(
                            "❌ **As there is no error message logging system and no channel has been provided so I am going to do nothing.**"
                        ),
                ],
            });
        }

        if (!channel && doc) {
            await errorlog.findOneAndDelete({
                Enabled: "true",
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.Wrong)
                        .setDescription(
                            "**❌ As no channel has been provided so I have disabled the error message logging system.**"
                        ),
                ],
            });
        }

        if (channel && !doc) {
            await errorlog.create({
                Channel: channel.id,
                Enabled: "true",
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.Good)
                        .setDescription(
                            `**✅ Successfully enabled the error message logging system. <#${channel.id}> | This channel has been set to log error messages.**`
                        ),
                ],
            });
        }

        if (channel && doc) {
            await errorlog.findOneAndUpdate(
                {
                    Enabled: "true",
                },
                {
                    Channel: channel.id,
                }
            );
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.colors.Good)
                        .setDescription(
                            `**✅ Successfully updated error message logging utility. <#${channel.id}> | This channel has been set to log error messages.**`
                        ),
                ],
            });
        }
    },
};
