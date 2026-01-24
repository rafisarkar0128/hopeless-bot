const { BaseButton } = require("@src/structures");
const { t } = require("i18next");

module.exports = class Button extends BaseButton {
  constructor() {
    super({
      data: {
        customId: "name",
      },
      options: {
        category: "general",
        global: true,
        disabled: false,
        guildOnly: false,
        testOnly: false,
        premium: false,
        nsfw: false,
      },
      permissions: {
        dev: false,
        bot: [],
        user: [],
      },
      player: {
        voice: false,
        active: false,
        playing: false,
      },
    });
  }

  /**
   * Execute function for the button.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async execute(client, interaction, metadata) {
    await interaction.reply("This button is in development.");
    return;
  }
};
