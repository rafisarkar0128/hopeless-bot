const { Message, EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/guild.js");
const { t } = require("i18next");

/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "messageCreate",
  /** @param {Message} message */
  execute: async (client, message) => {
    if (message.author.bot) return;

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (!message.content.match(prefixMention)) return;
    const settings = await getSettings(message.guild);
    const prefix = settings.prefix || client.config.default_prefix;

    const embed = new EmbedBuilder()
      .setTitle(t("events:prefix_mention.title"))
      .setDescription(
        t("events:prefix_mention.description", {
          username: client.user.username,
          owner: `<@${client.config.owner_id}>`,
          prefix: prefix,
        }),
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.config.colors.YellowGreen)
      .setFooter({
        text: t("default:embed.footer", {
          username: client.user.username,
          year: new Date().getFullYear(),
        }),
      });

    return message.reply({
      embeds: [embed],
    });
  },
};
