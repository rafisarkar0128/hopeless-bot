const { EmbedBuilder, ChannelType } = require("discord.js");

/**
 * A handler to send guild join logs
 * @param {import("@lib/index").DiscordClient} client
 * @param {import("discord.js").Guild} guild
 * @returns {Promise<void>}
 */
async function handleJoinLogs(client, guild) {
  if (!guild) return;

  const logChannelId = client.config.logsChannels.join;
  const channel = await client.channels.fetch(logChannelId);
  if (!channel || channel.type !== ChannelType.GuildText) return;

  const embed = new EmbedBuilder()
    .setColor(client.colors.joinLog)
    .setAuthor({ name: guild.name, iconURL: guild.iconURL({ extension: "png" }) })
    .setDescription(
      `I've been invited to **${guild.name}** and it has been added to my database (Guilds)!`
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
        name: "Created At",
        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
        inline: true,
      },
      {
        name: "Joined At",
        value: `<t:${Math.floor(guild.joinedTimestamp / 1000)}:F>`,
        inline: true,
      }
    )
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => null);
}

module.exports = { handleJoinLogs };
