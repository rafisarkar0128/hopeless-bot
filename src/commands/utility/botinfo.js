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

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "utility",
    cooldown: 60,
    premium: false,
    guildOnly: false,
    devOnly: true,
    voiceChannelOnly: false,
    botPermissions: ["SendMessages", "ReadMessageHistory", "SendMessagesInThreads"],
    userPermissions: ["SendMessages"],
  },
  prefix: {
    name: "botinfo",
    description: "📖 View bot's information.",
    aliases: ["btinfo", "bot", "stats", "botstats"],
    usage: "",
    disabled: true,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("botinfo")
      .setDescription("📖 View bot's information."),
    usage: "",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
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
        .setURL(client.config.links.github);

      const discordButton = new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.server);

      const inviteButton = new ButtonBuilder()
        .setLabel("Invite Me")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.invite);

      const websiteButton = new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setURL(client.config.links.website);

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
    },
  },
};
