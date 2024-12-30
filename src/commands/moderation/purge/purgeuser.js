const { Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  name: "purgeuser",
  category: "moderation",
  usage: "/purge user [user] [count]",
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

      const user = interaction.options.getMember("user");
      const count = interaction.options.getInteger("count");
      const fetchedMessages = await interaction.channel.messages.fetch();
      const messagesToDelete = [];

      let i = 0;
      fetchedMessages.filter(async (message) => {
        if (count <= i) return;
        if (message.interaction?.id == interaction.id) return;
        if (message.author.id == user.id) return messagesToDelete.push(message) && i++;
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
