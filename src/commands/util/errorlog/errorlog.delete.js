const { Client, ChatInputCommandInteraction } = require("discord.js");
const errorlog = require("../../../schemas/errorlog.js");

module.exports = {
    name: "errorlog.delete",
    subCommand: true,
    category: "util",
    usage: "/errorlog delete",
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

            let content;

            if (!doc) {
                content = "**Their is no error message logging system.**";
            } else {
                await errorlog.deleteOne({
                    guild: interaction.guild.id,
                });
                content =
                    "**Successfully removed error message logging system.**";
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
