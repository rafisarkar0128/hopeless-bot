const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("name")
        .setDescription(t("commands:name.description"))
        .setDefaultMemberPermissions(PermissionFlagsBits)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      options: {
        category: "general",
        cooldown: 5,
        global: true,
        disabled: {
          slash: false,
          prefix: false,
        },
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
      },
      prefixOptions: { aliases: [], minArgsCount: 0 },
      slashOptions: { ephemeral: false },
      details: {
        usage: "",
        examples: [],
        params: [
          {
            name: "",
            description: "",
            type: "",
            required: true,
          },
        ],
      },
    });
  }

  /**
   * Execute function for this prefix command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {{lng: string}} metadata
   * @returns {Promise<void>}
   */
  async executePrefix(client, message, args, metadata) {
    await message.reply("This command is in development.");
  }

  /**
   * Execute function for this slash command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {Object} metadata
   * @returns {Promise<void>}
   */
  async executeSlash(client, interaction, metadata) {
    await interaction.reply("This command is in development.");
  }

  /**
   * Autocomplete function for autocomplete options of this command.
   * @param {import("@lib/index").DiscordClient} client
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
};
