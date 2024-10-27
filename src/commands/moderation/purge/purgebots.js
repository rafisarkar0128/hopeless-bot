const { Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "purgebots",
  category: "moderation",
  usage: "/purge bots [amount]",
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
      const count = interaction.options.getInteger("count");
      const fetchedMessages = await interaction.channel.messages.fetch();
      const messagesToDelete = [];

      let i = 0;
      fetchedMessages.filter(async (message) => {
        if (count <= i) return;
        if (message.interaction?.id == interaction.id) return;
        if (message.author.bot) return messagesToDelete.push(message) && i++;
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
