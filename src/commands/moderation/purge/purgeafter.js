const { Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "purgeafter",
  category: "moderation",
  usage: "/purge after [message]",
  /**
   *
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  execute: async (client, interaction) => {
    try {
      await interaction.deferReply({
        ephemeral: true,
      });

      const messageLink = interaction.options.getString("message");
      const fetchedMessages = await interaction.channel.messages.fetch();
      const fetchedMessage = fetchedMessages.get(messageLink.split("/").pop());
      const messagesToDelete = [];

      fetchedMessages.filter(async (message) => {
        if (message.interaction?.id == interaction.id) return;
        if (fetchedMessage && message.createdTimestamp > fetchedMessage.createdTimestamp)
          return messagesToDelete.push(message);
      });

      const deletedMessages = await interaction.channel.bulkDelete(
        messagesToDelete,
        true,
      );

      interaction.followUp({
        content: `\`\`\`m\n${deletedMessages.size} ${
          deletedMessages.size <= 1 ? "message has" : "messages have"
        } been deleted.\n\`\`\``,
        ephemeral: true,
      });
    } catch (error) {
      throw error;
    }
  },
};
