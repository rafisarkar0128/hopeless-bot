const { Client, ChatInputCommandInteraction } = require("discord.js");
const errorlog = require("../../schemas/errorlog.js");

module.exports = {
    name: "errorlog.toggle",
    category: "util",
    usage: "/errorlog toggle",
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

            if (!doc) {
                return interaction.reply({
                    content: "**There is no error message logging system.**",
                    ephemeral: true,
                });
            }

            function updateErrorLog() {
                if (doc.enabled === "true") {
                    doc.$set("enabled", "false") && doc.save();
                    return "Turned **off** the errorlog.";
                }
                if (doc.enabled === "false") {
                    doc.$set("enabled", "true") && doc.save();
                    return "Turned **on** the errorlog.";
                }
            }

            return interaction.reply({
                content: updateErrorLog(),
                ephemeral: true,
            });
        } catch (error) {
            throw error;
        }
    },
};
