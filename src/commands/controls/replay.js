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
        .setName("replay")
        .setDescription(t("commands:replay.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
      options: {
        category: "music",
        cooldown: 5,
        global: true,
        guildOnly: true,
        player: {
          voice: true,
          active: true,
          playing: true,
        },
      },
      prefixOptions: {
        aliases: ["repl", "rplay", "replaytrack", "rewind"],
        minArgsCount: 0,
      },
      details: {
        usage: "replay",
        examples: ["replay", "repl", "rplay", "replaytrack", "rewind"],
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
    const player = client.lavalink.players.get(message.guildId);

    if (!player.queue.current?.info.isSeekable) {
      await message.reply(t("player:notReplayable", { lng: metadata.locale }));
      return;
    }

    await player.seek(0);
    await message.reply(t("player:replaying", { lng: metadata.locale }));
  }

  /**
   * Execute function for this slash command.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {Promise<void>}
   */
  async executeSlash(client, interaction, metadata) {
    await interaction.deferReply();
    const player = client.lavalink.players.get(interaction.guildId);

    if (!player.queue.current?.info.isSeekable) {
      await interaction.followUp(t("player:notReplayable", { lng: metadata.locale }));
      return;
    }

    await player.seek(0);
    await interaction.followUp(t("player:replaying", { lng: metadata.locale }));
  }
};
