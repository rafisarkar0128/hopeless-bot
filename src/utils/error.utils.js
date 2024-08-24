const { Client, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Error} error
 * @returns
 */
async function sendErrors(client, error) {
    try {
        const errorlog = require("../schemas/errorlog.js");
        if (!errorlog) return;

        const doc = await errorlog.findOne({ enabled: "true" });
        if (!doc) return;

        const guild = await client.guilds.fetch(doc.guild);
        if (!guild) return;

        const channel = await guild.channels.fetch(doc.channel);
        if (!channel) return;

        return channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.colors.wrong)
                    .setTitle(` Error Messages Logging System`)
                    .setDescription(
                        `<:error_logo:1276700084293079161>  _An error has occured_.\n\n**Error Code:** \`${error.name}\`\n**Error Message:** \`${error.message}\`\n**Stack:** \`\`\`yml\n${error.stack}\`\`\``
                    )
                    .setFooter({
                        text: `Memory: ${(
                            process.memoryUsage().heapUsed /
                            1024 /
                            1024
                        ).toFixed(2)} MB | CPU: ${(
                            process.cpuUsage().system /
                            1024 /
                            1024
                        ).toFixed(2)}% | Ping: ${client.ws.ping}ms`,
                    }),
            ],
        });
    } catch (error) {
        throw error;
    }
}

module.exports = { sendErrors };
