const { Message, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
  once: false,
  rest: false,
  /**
   * @param {import("../../structures/DiscordBot.js").DiscordBot} client
   * @param {Message} message
   * @returns
   */
  execute: async (client, message) => {
    if (message.author.bot) return;

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (!message.content.match(prefixMention)) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL(),
      })
      .setTitle("Did you just mention my me?")
      .setDescription(
        `I am ${client.user.username}, a bot developed by **theassassin0128** to manage this server. For more information or help use **\`/help\`**.`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(
        client.colors.array[
          Math.floor(Math.random() * client.colors.array.length)
        ]
      )
      .setFooter({
        text: `Powered by ${client.user.username}`,
      });

    return message.reply({
      embeds: [embed],
    });
  },
};
