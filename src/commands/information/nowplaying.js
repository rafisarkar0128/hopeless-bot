const { BaseCommand } = require("@src/structures");
const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  EmbedBuilder,
} = require("discord.js");
const { t } = require("i18next");

module.exports = class Command extends BaseCommand {
  constructor() {
    super({
      data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription(t("commands:nowplaying.description"))
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
        },
      },
      prefixOptions: {
        disabled: false,
        aliases: ["now", "np"],
        minArgsCount: 0,
      },
      slashOptions: {
        disabled: false,
      },
      details: {
        usage: "nowplaying",
        examples: ["nowplaying"],
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
    const embed = this.getTrackInfo(client, message.guild, metadata);
    await message.reply({ content: null, embeds: [embed] });
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
    const embed = this.getTrackInfo(client, interaction.guild, metadata);
    await interaction.followUp({ embeds: [embed] });
  }

  /**
   * A function to get the current track info.
   * @param {import("@lib/index").DiscordClient} client
   * @param {import("discord.js").Guild} guild
   * @param {import("@database/index").Structures.Guild} metadata
   * @returns {EmbedBuilder}
   */
  getTrackInfo(client, guild, { locale: lng }) {
    const player = client.lavalink.players.get(guild.id);
    const track = player.queue.current;
    const position = player.position;
    const duration = track.info.duration;
    const bar = client.utils.progressBar(position, duration, 20);

    const titleString = `**[${`${client.utils.sliceString(track.info.title, 20)}`}](<${track.info.uri}>)**`;
    const durationString = `\`${client.utils.formatTime(position)} / ${
      track.info.isStream ? t("player:live", { lng }) : client.utils.formatTime(track.info.duration)
    }\``;

    const embed = new EmbedBuilder()
      .setColor(client.lavalink.getColor(track.info.sourceName))
      .setAuthor({
        name: t("player:nowPlaying", { lng }),
        iconURL: guild?.iconURL({ extension: "png" }),
      })
      .setThumbnail(track.info.artworkUrl)
      .setDescription(
        [
          `${t("player:currentTrackInfo", {
            lng,
            track: titleString,
            duration: durationString,
          })} `,
          `- ${t("player:requestedBy", { lng, user: `<@${track.requester.id}>` })}`,
          `\n${bar}`,
        ].join("\n")
      );
    return embed;
  }
};
