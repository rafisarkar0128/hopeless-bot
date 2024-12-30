const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Message,
  Embed,
  Attachment,
  GuildMember,
} = require("discord.js");
const { profileImage } = require("discord-arts");
const { DateTime } = require("luxon");
const { t } = require("i18next");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "information",
    cooldown: 20,
    premium: false,
    guildOnly: true,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: ["SendMessages", "ReadMessageHistory"],
    userPermissions: ["SendMessages"],
  },
  prefix: {
    name: "memberinfo",
    description: "📖 View your or any member's information.",
    aliases: ["userinfo", "infouser", "uinfo", "minfo", "user", "member"],
    usage: "<GuildMember|InteractionUser>",
    disabled: false,
    minArgsCount: 1,
    subcommands: [],
    execute: async (client, message, args) => {
      const waitEmbed = new EmbedBuilder()
        .setColor(client.colors.Good)
        .setTitle("**Please be patient and wait for the embed.**");
      const reply = await message.reply({
        embeds: [waitEmbed],
      });

      var member = message.member;
      const patternMatch = args[0].match(/(\d{17,20})/);
      if (patternMatch) {
        const id = patternMatch[1];
        member = await message.guild.members.fetch(id);
      }

      const { embed, imageAttachment } = await getMemberEmbed(client, message, member);
      return reply.edit({
        embeds: [embed],
        files: [imageAttachment],
      });
    },
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName("memberinfo")
      .setDescription("📖 View your or any member's information.")
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("Select a member or leave empty to view your own info.")
          .setRequired(false),
      ),
    usage: "[member] <GuildMember|InteractionUser>",
    ephemeral: false,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      await interaction.deferReply();

      const member = interaction.options.getMember("member") || interaction.member;
      const { embed, imageAttachment } = await getMemberEmbed(
        client,
        interaction,
        member,
      );

      return interaction.followUp({
        embeds: [embed],
        files: [imageAttachment],
      });
    },
  },
};

/** Function to get memberinfo Embed and image attachment
 * @param {import("@lib/DiscordBot").DiscordBot} client
 * @param {ChatInputCommandInteraction | Message} ctx
 * @param {GuildMember} member
 * @returns {Promise<{embed: Embed,imageAttachment: Attachment}>}
 */
async function getMemberEmbed(client, ctx, member) {
  const banner = (await member.user.fetch()).bannerURL({
    size: 4096,
  });
  const avatar = member.user.displayAvatarURL({
    size: 4096,
  });

  const profileBuffer = await profileImage(member.id, {
    customBackground: banner ? "" : `${process.cwd()}/src/assets/mountains_dark.jpg`,
    usernameColor: client.colors.Aquamarine,
    tagColor: client.colors.StandBy,
    removeAvatarFrame: false,
  });
  const imageAttachment = new AttachmentBuilder(profileBuffer, {
    name: "profile.png",
  });

  const joinTime = `${DateTime.fromMillis(member.joinedTimestamp).toFormat(
    "dd/LL/yyyy h:mm:ss",
  )} (${DateTime.fromMillis(member.joinedTimestamp).toRelativeCalendar()})`;

  const creationTime = `${DateTime.fromMillis(member.user.createdTimestamp).toFormat(
    "dd/LL/yyyy h:mm:ss",
  )} (${DateTime.fromMillis(member.user.createdTimestamp).toRelativeCalendar()})`;

  const Booster = member.premiumSince
    ? `Since ${DateTime.fromMillis(member.premiumSinceTimestamp).toFormat(
        "LLLL dd, yyyy",
      )}`
    : "No";

  const embed = new EmbedBuilder()
    .setTitle("General Information")
    .setColor(member.displayHexColor || client.utils.getRandomColor())
    .setDescription(
      `On <t:${parseInt(member.joinedTimestamp / 1000)}:D> <@${
        member.id
      }> joind as the **${addSuffix(
        await getJoinedPosition(ctx, member.id),
      )}** member of this server.`,
    )
    .setImage("attachment://profile.png")
    .setThumbnail(avatar)
    .addFields(
      {
        name: "Username",
        value: `\`\`\`\n${member.user.username}\n\`\`\``,
        inline: true,
      },
      {
        name: "Nickname",
        value: `\`\`\`\n${member.user.displayName}\n\`\`\``,
        inline: true,
      },
      {
        name: "User ID",
        value: `\`\`\`m\n${member.user.id}\n\`\`\``,
        inline: false,
      },
      {
        name: "Badges",
        value: `${await addBadges(member.user.flags.toArray())}`,
        inline: true,
      },
      {
        name: "Is Boosting",
        value: Booster,
        inline: true,
      },
      {
        name: `Roles [${member.roles.cache.size - 1}]`,
        value: `${member.roles.cache
          .sort((a, b) => b.position - a.position)
          .map((role) => role)
          .join("")
          .replace("@everyone", "")}`,
        inline: false,
      },

      {
        name: "Joined this server on (DD/MM/YYYY)",
        value: `\`\`\`\n${joinTime}\n\`\`\``,
        inline: false,
      },
      {
        name: "Account created on (DD/MM/YYYY)",
        value: `\`\`\`\n${creationTime}\n\`\`\``,
        inline: false,
      },
      {
        name: "Avatar Url",
        value: `[Link](${avatar})`,
        inline: true,
      },
      {
        name: "Banner Url",
        value: `[Link](${banner})`,
        inline: true,
      },
    )
    .setFooter({
      text: t("default:embed.footer", {
        username: client.user.username,
        year: new Date().getFullYear(),
      }),
    });

  return { embed, imageAttachment };
}

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13) return number + "th";
  switch (number % 10) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
  }
  return number + "th";
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return [":x:"];
  const badgeMap = {
    ActiveDeveloper: "<:activedeveloper:1272302061739839539>",
    BugHunterLevel1: "<:discordbughunter1:1272302103594930196>",
    BugHunterLevel2: "<:discordbughunter2:1272302121282179135>",
    PremiumEarlySupporter: "<:discordearlysupporter:1272302136310628372>",
    Partner: "<:discordpartner:1272302197488488538>",
    Staff: "<:discordstaff:1272302221043826718>",
    HypeSquadOnlineHouse1: "<:hypesquadbravery:1272302257991581706>", // bravery
    HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1272302326874505268>", // brilliance
    HypeSquadOnlineHouse3: "<:hypesquadbalance:1272302274022215682>", // balance
    Hypesquad: "<:hypesquadevents:1272302310625906781>",
    CertifiedModerator: "<:discordmod:1272302149706973244>",
    VerifiedDeveloper: "<:discordbotdev:1272302089434828891>",
    BotHTTPInteractions: "<:supportscommands:1275412776936017931>",
    VerifiedBot:
      "<:verifiedapp1:1276544639779737694><:verifiedapp2:1276544658868142133><:verifiedapp3:1276544675393835168>",

    //"<:verifiedbot1:1275477687108108358><:verifiedbot2:1275477702362533991>" return verified bot logo,
  };
  return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔").join("");
}

/** Function to get guild member joined position
 * @param {ChatInputCommandInteraction | Message} ctx
 * @param {string} id
 * @returns {Promise<number>}
 */
async function getJoinedPosition(ctx, id) {
  let guildMembers = await ctx.guild.members.fetch();
  let position =
    Array.from(
      guildMembers.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).keys(),
    ).indexOf(id) + 1;
  return position;
}
