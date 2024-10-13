const {
  SlashCommandBuilder,
  EmbedBuilder,
  version,
  AttachmentBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { profileImage } = require("discord-arts");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  name: "botinfo",
  description: "📖 View bot's information.",
  cooldown: 60,
  category: "UTILITY",
  isPremium: false,
  isGlobal: true,
  isGuildOnly: false,
  isDevOnly: true,
  isVoceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  prefixCommand: {
    enabled: true,
    aliases: ["btinfo", "bot"],
    usage: "",
    minArgsCount: 0,
    subcommands: [],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    usage: "/botinfo",
    data: new SlashCommandBuilder()
      .setName("botinfo")
      .setDescription("📖 View bot's information."),
  },
  //run: async (client, message, args) => {},
  execute: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const days = Math.floor(client.uptime / 86400000);
      const hours = Math.floor(client.uptime / 3600000) % 24;
      const minutes = Math.floor(client.uptime / 60000) % 60;
      const seconds = Math.floor(client.uptime / 1000) % 60;

      const reply = await interaction.fetchReply();

      const wsPing = client.ws.ping;
      const apiPing = reply.createdTimestamp - interaction.createdTimestamp;

      const profileBuffer = await profileImage(client.user.id, {
        usernameColor: client.colors.PowderBlue,
        presenceStatus: client.user.presence.status,
        borderColor: client.colors.PowderBlue,
      });
      const imageAttachment = new AttachmentBuilder(profileBuffer, {
        name: "profile.png",
      });

      const member = await interaction.guild.members.fetch(client.user.id);

      const embed = new EmbedBuilder()
        .setColor(client.utils.getRandomColor())
        .setTitle(`${client.user.tag}'s Information`)
        .setDescription(
          [`**Tag:** ${client.user.tag}`, `**Version:** ${client.pkg.version}`].join(
            "\n",
          ),
        )
        .setThumbnail(client.user.avatarURL())
        .setImage("attachment://profile.png")
        .addFields(
          {
            name: `📡 WS Ping`,
            value: `\`\`\`yml\n${
              wsPing <= 200 ? "🟢" : wsPing <= 400 ? "🟡" : "🔴"
            } ${wsPing}ms\`\`\``,
            inline: true,
          },
          {
            name: `🛰 API Ping`,
            value: `\`\`\`yml\n${
              apiPing <= 200 ? "🟢" : apiPing <= 400 ? "🟡" : "🔴"
            } ${apiPing}ms\`\`\``,
            inline: true,
          },
          {
            name: `⏲ Uptime`,
            value: `\`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\`\`\``,
            inline: false,
          },
          {
            name: "LANGUAGE & LIBRARY",
            value: [
              `**Name :** [nodejs](https://nodejs.org/en/) (${process.version})`,
              `**Library :** [discord.js](https://discord.js.org/#/) (${version})`,
            ].join("\n"),
            inline: true,
          },
          {
            name: "SOURCE CODE",
            value: `Repository is available on github`,
            inline: true,
          },
        )
        .setFooter({
          text: `Powered by ${client.user.username}`,
        });

      const githubButton = new ButtonBuilder()
        .setLabel("GitHub")
        .setStyle(ButtonStyle.Link)
        .setURL("https://github.com/theassassin0128/Hopeless-Bot#readme");

      const discordButton = new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/E6H9VvBdTk");

      const inviteButton = new ButtonBuilder()
        .setLabel("Invite Me")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/oauth2/authorize?client_id=1272259032098275358");

      const websiteButton = new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setURL("https://theassassin0128.github.io/Hopeless-Bot");

      const actionRow = new ActionRowBuilder()
        .addComponents(githubButton)
        .addComponents(discordButton)
        .addComponents(inviteButton)
        .addComponents(websiteButton);

      return interaction.editReply({
        embeds: [embed],
        components: [actionRow],
        files: [imageAttachment],
      });
    } catch (error) {
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("An error occourred. Try again later.")
            .setColor(client.colors.StandBy),
        ],
      });
      throw error;
    }
  },
};
