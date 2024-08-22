const { Client, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 * @returns
 */
async function sendErrors(client, error, origin) {
    try {
        const errorlog = require("../schemas/errorlog.js");
        if (!errorlog) return;

        const doc = await errorlog.findOne({ enabled: "true" });
        if (!doc) return;

        const guild = await client.guilds.fetch(doc.guild);
        if (!guild) return;

        const channel = await guild.channels.fetch(doc.channel);
        if (!channel) return;

        const errorEmbed = new EmbedBuilder()
            .setTitle("An Error Occoured")
            .setFields(
                {
                    name: "Error",
                    value: `\`\`\`\n${error}\n\`\`\``,
                    inline: false,
                },
                {
                    name: "origin",
                    value: `\`\`\`\n${origin ? origin : "?"}\n\`\`\``,
                    inline: false,
                }
            )
            .setColor(client.colors.americanRose)
            .setFooter({
                text: `Powered by ${client.user.username}`,
            });

        return channel.send({ embeds: [errorEmbed] });
    } catch (error) {
        throw error;
    }
}

module.exports = { sendErrors };
