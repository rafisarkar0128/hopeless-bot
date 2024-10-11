const {
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  ChatInputCommandInteraction,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  name: "ping",
  description: "🏓Pong! Replies with an embed containing ping information.",
  cooldown: 20,
  category: "UTILITY",
  isPremium: false,
  isGlobal: true,
  isGuildOnly: false,
  isDevOnly: false,
  isVCOnly: false,
  botPermissions: [],
  userPermissions: [],
  prefixCommand: {
    enabled: true,
    aliases: ["latency"],
    usage: "",
    minArgsCount: 0,
    subcommands: [],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    usage: "/ping",
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("🏓Pong! Replies with an embed containing ping information."),
  },
  run: async (client, message) => {
    const waitEmbed = new EmbedBuilder()
      .setColor(client.colors.Good)
      .setTitle("**Please be patient and wait for the embed.**");
    const reply = await message.reply({
      embeds: [waitEmbed],
    });

    return reply.edit({
      content: "",
      embeds: [await getPingEmbed(client, message, reply)],
    });
  },
  execute: async (client, interaction) => {
    const reply = await interaction.deferReply({
      fetchReply: true,
    });

    return interaction.followUp({
      embeds: [await getPingEmbed(client, interaction, reply)],
    });
  },
};

/** Function to get ping embed
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @param {} reply
 * @returns {Promise<Embed>}
 */
async function getPingEmbed(client, ctx, reply) {
  const days = Math.floor(client.uptime / 86400000);
  const hours = Math.floor(client.uptime / 3600000) % 24;
  const minutes = Math.floor(client.uptime / 60000) % 60;
  const seconds = Math.floor(client.uptime / 1000) % 60;

  const clientPing = reply.createdTimestamp - ctx.createdTimestamp;
  const wsPing = client.ws.ping;

  const embed = new EmbedBuilder()
    .setTitle("MY RUNTIME STATS")
    .setColor(client.utils.getRandomColor())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields([
      {
        name: `📡 WS Ping`,
        value: `\`\`\`yml\n${
          wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"
        } ${wsPing}ms\`\`\``,
        inline: true,
      },
      {
        name: `🛰 BOT Ping`,
        value: `\`\`\`yml\n${
          clientPing <= 200 ? "🟢" : clientPing <= 400 ? "🟡" : "🔴"
        } ${clientPing}ms\`\`\``,
        inline: true,
      },
      {
        name: `⏲ Uptime`,
        value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\n\`\`\``,
        inline: false,
      },
    ])
    .setFooter({
      text: client.config.bot.footer,
    });

  return embed;
}
