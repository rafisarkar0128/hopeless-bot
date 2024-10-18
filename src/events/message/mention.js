const { Message, EmbedBuilder } = require("discord.js");

/** @type {import("@structures/event").EventStructure} */
module.exports = {
  name: "messageCreate",
  /** @param {Message} message */
  execute: async (client, message) => {
    if (message.author.bot) return;

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (!message.content.match(prefixMention)) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTitle("Did you just mention me?")
      .setDescription(
        `I am ${client.user.username}, a bot developed by **<@${client.config.ownerId}>** to manage this server. For help use **\`/help\`**. For more information visit my website.`,
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(client.utils.getRandomColor())
      .setFooter({
        text: client.config.bot.footer,
      });

    return message.reply({
      embeds: [embed],
    });
  },
};
