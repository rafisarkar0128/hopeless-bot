const { EmbedBuilder, ChannelType } = require("discord.js");

/**
 * A handler to send guild leave logs
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").Guild} guild
 * @returns {Promise<void>}
 */
async function handleLeaveLogs(client, guild) {
  if (!guild) return;

  const logChannelId = client.config.logsChannels.leave;
  const channel = await client.channels.fetch(logChannelId);
  if (!channel || channel.type !== ChannelType.GuildText) return;

  const embed = new EmbedBuilder()
    .setColor(client.colors.leaveLog)
    .setAuthor({
      name: guild.name || "Unknown Guild",
      iconURL: guild.iconURL({ extension: "png" }),
    })
    .setDescription(
      `I was kicked from **${guild.name}** and I have modified \`leftAt\` to <t:${Math.floor(Date.now() / 1000)}:F> in my database (Guilds)!`
    )
    .setThumbnail(guild.iconURL({ extension: "png" }))
    .addFields(
      {
        name: "Owner",
        value: (await guild.fetchOwner()).user.username,
        inline: true,
      },
      { name: "ID", value: guild.id, inline: true },
      {
        name: "Members",
        value: guild.memberCount.toString(),
        inline: true,
      },
      {
        name: "Joined At",
        value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>`,
        inline: true,
      },
      {
        name: "Left At",
        value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
        inline: true,
      }
    )
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => null);
}

module.exports = { handleLeaveLogs };
