const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("name")
        .setDescription(t("commands:name.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      usage: "",
      examples: [""],
      category: "general",
      cooldown: 5,
      global: true,
      disabled: false,
      guildOnly: false,
      testOnly: false,
      premium: false,
      vote: false,
      nsfw: false,
      permissions: {
        dev: true,
        bot: [],
        user: [],
      },
      player: {
        voice: false,
        dj: false,
        active: false,
        djPerm: null,
      },
    });
  }

  /**
   * Execute function for this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {string} lng
   * @returns {Promise<void>}
   */
  async execute(client, interaction, lng) {
    client.logger.debug("Command is working.");
    await interaction.reply("This command is in development.");
  }

  /**
   * Autocomplete function for autocomplete options of this command.
   * @param {import("@structures/BotClient.js")} client
   * @param {import("discord.js").AutocompleteInteraction} interaction
   * @returns {Promise<void>}
   */
  async autocomplete(client, interaction) {
    const focused = interaction.options.getFocused();
    if (!focused || focused.length === 0) return;
    const choices = [
      {
        name: focused,
        value: "focused",
      },
    ];
    return await interaction.respond(choices);
  }
}

module.exports = { Command };
