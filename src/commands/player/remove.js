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
        .setName("remove")
        .setDescription(t("commands:remove.description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(t("commands:remove.options.number"))
            .setRequired(true)
        ),
      options: {
        category: "music",
        cooldown: 5,
        global: true,
        guildOnly: true,
        player: {
          voice: true,
          active: true,
        },
      },
      prefixOptions: {
        aliases: ["rm", "delete", "del", "trash", "discard", "erase"],
        minArgsCount: 1,
      },
      details: {
        usage: "remove <number>",
        examples: ["remove 10", "remove 2"],
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
    const number = client.utils.parseInt(args[0]);

    if (player.queue.tracks.length === 0) {
      await message.reply({ content: t("player:noTrack", { lng: metadata.locale }) });
      return;
    }

    if (number <= 0 || number > player.queue.tracks.length) {
      await message.reply(t("player:invalidTrackNumber", { lng: metadata.locale }));
      return;
    }

    const { removed } = await player.queue.remove(number - 1);
    await message.reply(
      t("player:removeTrack", {
        lng: metadata.locale,
        number,
        track: `[${client.utils.sliceString(removed[0].info.title, 50)}](<${removed[0].info.uri}>)`,
      })
    );
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
    const number = interaction.options.getInteger("number", true);

    if (player.queue.tracks.length === 0) {
      await interaction.followUp({ content: t("player:noTrack", { lng: metadata.locale }) });
      return;
    }

    if (number <= 0 || number > player.queue.tracks.length) {
      await interaction.followUp(t("player:invalidTrackNumber", { lng: metadata.locale }));
      return;
    }

    const { removed } = await player.queue.remove(number - 1);
    await interaction.followUp(
      t("player:removeTrack", {
        lng: metadata.locale,
        number,
        track: `[${client.utils.sliceString(removed[0].info.title, 50)}](<${removed[0].info.uri}>)`,
      })
    );
  }
};
