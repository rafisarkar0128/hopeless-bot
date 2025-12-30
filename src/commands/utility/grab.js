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
        .setName("grab")
        .setDescription(t("commands:grab.description"))
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
        aliases: ["snatch", "dmsend", "dmsave"],
        minArgsCount: 0,
      },
      details: {
        usage: "grab",
        examples: ["grab", "snatch", "dmsend", "dmsave"],
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
    const player = client.lavalink.getPlayer(message.guildId);
    const song = player.queue.current;
    const songEmbed = new EmbedBuilder()
      .setColor(client.lavalink.getColor(song.info.sourceName))
      .setTitle(`**${song.info.title}**`)
      .setURL(song.info.uri)
      .setThumbnail(song.info.artworkUrl)
      .setDescription(
        t("commands:grab.content", {
          lng: metadata.locale,
          artist: client.utils.sliceString(song.info.author, 24),
          length: song.info.isStream ? "LIVE" : client.utils.formatTime(song.info.duration),
          requester: song.requester.username,
        })
      );

    try {
      await message.author.send({ embeds: [songEmbed] });
      await message.reply(t("commands:grab.checkDM", { lng: metadata.locale }));
    } catch (error) {
      await message.reply(t("commands:grab.DMfailed", { lng: metadata.locale }));
    }
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
    const player = client.lavalink.getPlayer(interaction.guildId);
    const song = player.queue.current;
    const songEmbed = new EmbedBuilder()
      .setColor(client.lavalink.getColor(song.info.sourceName))
      .setTitle(`**${song.info.title}**`)
      .setURL(song.info.uri)
      .setThumbnail(song.info.artworkUrl)
      .setDescription(
        t("commands:grab.content", {
          lng: metadata.locale,
          artist: client.utils.sliceString(song.info.author, 24),
          length: song.info.isStream ? "LIVE" : client.utils.formatTime(song.info.duration),
          requester: song.requester.username,
        })
      );

    try {
      await interaction.user.send({ embeds: [songEmbed] });
      await interaction.followUp(t("commands:grab.checkDM", { lng: metadata.locale }));
    } catch (error) {
      await interaction.followUp(t("commands:grab.DMfailed", { lng: metadata.locale }));
    }
  }
};
