const { EmbedBuilder } = require("discord.js");
const { t } = require("i18next");

/**
 * A function to handle bot mentions in messages
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").Message} message
 * @param {import("@database/index").Structures.Guild} metadata
 * @returns {Promise<void>}
 */
async function handleMention(client, message, metadata) {
  const { locale, prefix } = metadata;
  const embed = new EmbedBuilder()
    .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL({ extension: "png" }) })
    .setThumbnail(client.user.avatarURL({ extension: "png" }))
    .setColor(client.colors.main)
    .setDescription(t("embeds:mention.description", { lng: locale, user: client.user, prefix }))
    .setFooter({ text: t("embeds:mention.footer", { lng: locale }) })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

module.exports = { handleMention };
