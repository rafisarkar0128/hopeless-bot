const { Client, ChatInputCommandInteraction } = require("discord.js");
const errorlog = require("../../schemas/errorlog.js");

module.exports = {
    name: "errorlog.setup",
    category: "util",
    usage: "/errorlog setup [Channel]",
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        try {
            const doc = await errorlog.findOne({
                guild: interaction.guild.id,
            });

            const channel = interaction.options.getChannel("channel");
            if (!channel) {
                return interaction.followUp({
                    content: "A channel is required to finish the setup.",
                    ephemeral: true,
                });
            }

            let content;

            if (!doc) {
                await errorlog.create({
                    guild: interaction.guild.id,
                    channel: channel.id,
                    enabled: "true",
                });
                content = `From today onward all error messages will be send to <#${channel.id}>`;
            } else {
                doc.$set("channel", `${channel.id}`) && doc.save();
                content = `**Updated** error message logging channel - <#${channel.id}>`;
            }
            return interaction.reply({
                content: content,
                ephemeral: true,
            });
        } catch (error) {
            throw error;
        }
    },
};
