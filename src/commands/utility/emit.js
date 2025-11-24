const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription(t("commands:emit.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption((option) =>
          option
            .setName("event")
            .setDescription(t("commands:emit.options.event"))
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription(t("commands:emit.options.member"))
            .setRequired(false)
        ),
      options: {
        category: "utility",
        cooldown: 0,
        global: true,
        guildOnly: true,
        permissions: {
          dev: true,
        },
      },
      prefixOptions: {
        minArgsCount: 1,
      },
      details: {
        usage: "emit <event> [member]",
        examples: ["emit guildMemberAdd @User", "emit guildBanAdd @User"],
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
    const reply = await message.reply("This command is only available through slash commands.");
    setTimeout(() => {
      if (message.deletable) message.delete().catch(() => {});
      reply.delete().catch(() => {});
    }, 10_000);
  }

  /**
   * Execute function for this slash command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async executeSlash(client, interaction, metadata) {
    const { options } = interaction;
    const event = options?.getString("event", true);
    const member = options?.getMember("member") ?? interaction.member;

    switch (event) {
      case "guildMemberAdd": {
        client.emit("guildMemberAdd", member);
        break;
      }

      case "guildMemberRemove": {
        client.emit("guildMemberRemove", member);
        break;
      }

      case "guildBanAdd": {
        client.emit("guildBanAdd", member);
        break;
      }

      case "guildBanRemove": {
        client.emit("guildBanRemove", member);
        break;
      }

      case "guildCreate": {
        client.emit("guildCreate", interaction.guild);
        break;
      }

      case "guildDelete": {
        client.emit("guildDelete", interaction.guild);
        break;
      }

      default: {
        await interaction.reply({
          content: "This event cannot be emited manually at the moment.",
          flags: "Ephemeral",
        });
        return;
      }
    }

    await interaction.reply({
      content: t("commands:emit.response", { lng: metadata.locale, event }),
      flags: "Ephemeral",
    });
  }

  /**
   * Autocomplete function for autocomplete options of this command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").AutocompleteInteraction} interaction
   * @returns {Promise<void>}
   */
  async autocomplete(client, interaction) {
    const { events } = client.resources;
    const focused = interaction.options.getFocused().toLowerCase();

    /** @type {import("discord.js").ApplicationCommandChoicesData[]} */
    const choices = [];

    // If no input was provided
    if (!focused || focused.length === 0) {
      for (const ev of events.slice(0, 25)) {
        choices.push({ name: ev, value: ev });
      }
    }

    // If some type of input was provided
    else {
      for (const ev of events.filter((ev) => ev.toLowerCase().match(focused)).slice(0, 25)) {
        choices.push({ name: ev, value: ev });
      }
    }

    await interaction.respond(choices);
  }
};
