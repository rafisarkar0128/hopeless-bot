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
        .setName("loop")
        .setDescription(t("player:description"))
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addSubcommand((option) =>
          option.setName("off").setDescription(t("commands:loop.subcommands.off"))
        )
        .addSubcommand((option) =>
          option.setName("track").setDescription(t("commands:loop.subcommands.track"))
        )
        .addSubcommand((option) =>
          option.setName("queue").setDescription(t("commands:loop.subcommands.queue"))
        ),
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
        aliases: ["lp", "repeat", "repeatmode"],
        minArgsCount: 0,
      },
      details: {
        usage: "loop <queue|track|off>",
        examples: ["loop off", "loop queue", "loop track"],
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
    let content = "";

    switch (player.repeatMode) {
      case "off": {
        player.setRepeatMode("track");
        content = t("player:loopingTrack", { lng: metadata.locale });
        break;
      }
      case "track": {
        player.setRepeatMode("queue");
        content = t("player:loopingQueue", { lng: metadata.locale });
        break;
      }
      case "queue": {
        player.setRepeatMode("off");
        content = t("player:loopingOff", { lng: metadata.locale });
        break;
      }
    }

    await message.reply({ content });
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
    const subcommand = interaction.options.getSubcommand(true);
    const player = client.lavalink.players.get(interaction.guildId);
    let content = "";

    switch (subcommand) {
      case "off": {
        player.setRepeatMode("off");
        content = t("player:loopingOff", { lng: metadata.locale });
        break;
      }
      case "track": {
        player.setRepeatMode("track");
        content = t("player:loopingTrack", { lng: metadata.locale });
        break;
      }
      case "queue": {
        player.setRepeatMode("queue");
        content = t("player:loopingQueue", { lng: metadata.locale });
        break;
      }
    }

    await interaction.followUp({ content });
  }
};
