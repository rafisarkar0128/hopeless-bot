// variables
const {
    Client,
    SlashCommandBuilder,
    EmbedBuilder,
    version,
    ChatInputCommandInteraction,
} = require("discord.js");
const pkg = require("../../../package.json");

// exporting the modules
module.exports = {
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Replies with current stats of the bot.")
        .setDMPermission(true),
    category: "util",
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @returns
     */
    execute: async (client, interaction) => {
        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;
        const wsPing = client.ws.ping;
        const embed = new EmbedBuilder()
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            })
            .setColor(client.colors.androidGreen)
            .setTitle("__GENERAL INFO__")
            .setDescription(
                [
                    `**Name :** ${client.user.username}`,
                    `**Tag :** ${client.user.tag}`,
                    `**Version :** ${pkg.version}`,
                    `**Website :** Coming soon.`,
                ].join("\n")
            )
            .setThumbnail(client.user.displayAvatarURL({ size: 4096 }))
            .addFields(
                {
                    name: "__BOT INFO__",
                    value: [
                        `**Status :** Online`,
                        `**Ping :** ${wsPing}ms`,
                        `**Uptime :**\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\`\`\``,
                    ].join("\n"),
                },
                {
                    name: "__LANGUAGE & LIBRARY INFO__",
                    value: [
                        `**Name :** [nodejs](https://nodejs.org/en/)`,
                        `**Library :** [discord.js](https://discord.js.org/#/)`,
                        `**Version :** ${version}`,
                    ].join("\n"),
                }
            )
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
        });
    },
};
