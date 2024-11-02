const {
  SlashCommandBuilder,
  EmbedBuilder,
  Embed,
  ChatInputCommandInteraction,
  Message,
} = require("discord.js");
const { t } = require("i18next");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "utility",
    cooldown: 0,
    premium: false,
    guildOnly: false,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: ["SendMessages", "ReadMessageHistory"],
    userPermissions: ["SendMessages", "ReadMessageHistory"],
  },
  prefix: {
    name: "ping",
    description: "🏓 Pong! Replies with bot's response time.",
    aliases: ["latency"],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message) => {
      const reply = await message.reply({
        content: t("commands:ping.reply.content"),
      });
      reply.edit({
        content: "",
        embeds: [await getPingEmbed(client, message, reply)],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("🏓Pong! Replies with bot's response time."),
    usage: "",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const reply = await interaction.fetchReply();
      interaction.followUp({
        embeds: [await getPingEmbed(client, interaction, reply)],
      });
    },
  },
};

/** Function to get ping embed
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @param {Message} reply
 * @returns {Promise<Embed>}
 */
async function getPingEmbed(client, ctx, reply) {
  const response = reply.createdTimestamp - ctx.createdTimestamp;
  const gateway = client.ws.ping;

  const days = Math.floor(client.uptime / 86400000);
  const hours = Math.floor(client.uptime / 3600000) % 24;
  const minutes = Math.floor(client.uptime / 60000) % 60;
  const seconds = Math.floor(client.uptime / 1000) % 60;

  const { Good, Standby, Wrong } = client.config.colors;
  const embed = new EmbedBuilder()
    .setColor(response <= 200 ? Good : response <= 400 ? Standby : Wrong)
    .setThumbnail(client.user.displayAvatarURL())
    .addFields([
      {
        name: `📡 Gateway Ping`,
        value: `\`\`\`yml\n${
          gateway <= 200 ? "🟢" : gateway <= 400 ? "🟡" : "🔴"
        } ${gateway}ms\`\`\``,
        inline: true,
      },
      {
        name: `🛰 Response Time`,
        value: `\`\`\`yml\n${
          response <= 200 ? "🟢" : response <= 400 ? "🟡" : "🔴"
        } ${response}ms\`\`\``,
        inline: true,
      },
      {
        name: `⏲ Uptime`,
        value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\n\`\`\``,
        inline: false,
      },
    ])
    .setFooter({
      text: t("default:embed.footer", {
        username: client.user.username,
        year: new Date().getFullYear(),
      }),
    });

  return embed;
}
