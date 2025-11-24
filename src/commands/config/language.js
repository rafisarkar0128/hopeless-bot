const { BaseCommand } = require("@structures/index.js");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

/**
 * A new Command extended from BaseCommand
 * @extends {BaseCommand}
 */
module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("language")
        .setDescription(t("commands:language.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription(t("commands:language.options.language"))
            .setRequired(true)
            .setAutocomplete(true)
        ),
      options: {
        category: "config",
        cooldown: 120,
        global: true,
        guildOnly: true,
        permissions: {
          user: ["ManageGuild"],
        },
      },
      prefixOptions: {
        aliases: ["lang", "lng"],
        minArgsCount: 1,
      },
      details: {
        usage: "language <language|locale>",
        examples: ["language en-US", "language language:en-US"],
      },
    });
  }

  /**
   * Execute function for this prefix command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async executePrefix(client, message, args, metadata) {
    const lng = args[0].toLowerCase();
    const { availableLocales } = client.config;
    const language = client.resources.languages.find((l) => {
      return (
        l.locale.toLowerCase() === lng ||
        l.name.toLowerCase() === lng ||
        l.native.toLowerCase() === lng
      );
    });

    if (!language || !availableLocales.includes(language.locale)) {
      const reply = await message.reply({
        content: t("commands:language.notAvailable", { lng: metadata.locale }),
      });
      setTimeout(() => {
        if (message.deletable) message.delete();
        reply.delete();
      }, 5000);
      return;
    }

    await client.mongodb.guilds.update(message.guildId, "locale", language.locale);
    const reply = await message.reply({
      content: t("commands:language.reply", {
        lng: language.locale,
        language: `${language.native} (${language.name})`,
      }),
    });
  }

  /**
   * Execute function for this slash command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async executeSlash(client, interaction, metadata) {
    await interaction.deferReply({ flags: "Ephemeral" });

    const locale = interaction.options.getString("language", true);
    const { availableLocales } = client.config;

    if (!locale || !availableLocales.includes(locale)) {
      return await interaction.followUp({
        content: t("commands:language.notAvailable", { lng: metadata.locale }),
      });
    }

    const language = client.resources.languages.find((lng) => lng.locale === locale);
    await client.mongodb.guilds.update(interaction.guildId, "locale", locale);
    return await interaction.followUp({
      content: t("commands:language.response", {
        lng: language.locale,
        language: `${language.native} (${language.name})`,
      }),
    });
  }

  /**
   * Autocomplete function for autocomplete options of this command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").AutocompleteInteraction} interaction
   * @returns {Promise<void>}
   */
  async autocomplete(client, interaction) {
    const { availableLocales } = client.config;
    const focused = interaction.options.getFocused().toLowerCase();
    /** @type {import("discord.js").ApplicationCommandChoicesData[]} */
    const languageData = [];

    // If no input was provided
    if (!focused) {
      client.resources.languages
        .filter((lng) => availableLocales.some((l) => l === lng.locale))
        .slice(0, 25)
        .forEach((lng) => {
          languageData.push({
            name: `${lng.name} (${lng.native})`,
            value: lng.locale,
          });
        });
    }

    // If some type of input was provided
    else {
      client.resources.languages
        .filter((lng) => {
          return (
            lng.name.toLowerCase().match(focused) ||
            lng.locale.toLowerCase().match(focused) ||
            lng.native.toLowerCase().match(focused)
          );
        })
        .slice(0, 25)
        .forEach((lng) => {
          languageData.push({
            name: `${lng.name} (${lng.native})`,
            value: lng.locale,
          });
        });
    }

    await interaction.respond(languageData);
  }
};
