// variables
const {
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder,
} = require("discord.js");
const { profileImage } = require("discord-arts");
const axios = require("axios");
const path = require("path");
const fs = require("node:fs");
const moment = require("moment");

// exporting the module
module.exports = {
    data: new SlashCommandBuilder()
        .setName("memberinfo")
        .setDescription("📖 View your or any member's information.")
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription(
                    "View a member's information. Leave empty to view your own."
                )
                .setRequired(false)
        ),
    category: "public",
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        await interaction.deferReply();

        const member =
            interaction.options.getMember("member") || interaction.member;

        if (member.user.bot)
            return interaction.editReply({
                content:
                    "At this moment, bots are not supported for this command",
            });

        const userdata = await axios.get(
            //`https://discord.com/api/guilds/${interaction.guild.id}/members/${member.id}`,
            `https://discord.com/api/users/${member.id}`,
            {
                headers: {
                    Authorization: `Bot ${client.config.token}`,
                    //"x-darts-version": "0.6.1",
                },
            }
        );

        console.log(userdata.data);

        const packageJsonPath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "package.json"
        );
        const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8")
        );
        const version = packageJson.version;
        console.log(version);

        try {
            const fetchedMembers = await interaction.guild.members.fetch();
            const profileBuffer = await profileImage(member.id);
            const imageAttachment = new AttachmentBuilder(profileBuffer, {
                name: "profile.png",
            });

            const joinedPosition =
                Array.from(
                    fetchedMembers
                        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                        .keys()
                ).indexOf(member.id) + 1;

            const topRoles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map((role) => role)
                .slice(0, 3);

            const userBadges = member.user.flags.toArray();
            const joinTime = parseInt(member.joinedTimestamp / 1000);
            const creationTime = parseInt(member.user.createdTimestamp / 1000);
            const Booster = member.premiumSince
                ? "<:discordboost7:1269222761234956308>"
                : ":x:";

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${member.user.tag} | General Information`,
                    iconURL: member.displayAvatarURL(),
                })
                .setColor(member.displayHexColor || colour.main)
                .setDescription(
                    `On <t:${joinTime}:D> ${
                        member.user.username
                    } joind as the **${addSuffix(
                        joinedPosition
                    )}** member of this server.`
                )
                .setImage("attachment://profile.png")
                .addFields([
                    {
                        name: "Badges",
                        value: `${addBadges(userBadges).join("")}`,
                        inline: true,
                    },
                    { name: "Booster", value: `${Booster}`, inline: true },
                    {
                        name: "Top Roles",
                        value: `${topRoles.join("")}`,
                        inline: false,
                    },
                    {
                        name: "Created",
                        value: `<t:${creationTime}:R>`,
                        inline: true,
                    },
                    {
                        name: "Joined",
                        value: `<t:${joinTime}:R>`,
                        inline: true,
                    },
                    {
                        name: "Identifier",
                        value: `${member.user.id}`,
                        inline: false,
                    },
                    {
                        name: "Avatar",
                        value: `[Link](${member.displayAvatarURL()})`,
                        inline: true,
                    },
                    {
                        name: "Banner",
                        value: `[Link](${(
                            await member.user.fetch()
                        ).bannerURL()})`,
                        inline: true,
                    },
                ]);

            return interaction.editReply({
                embeds: [embed],
                files: [imageAttachment],
            });
        } catch (error) {
            throw error;
        }
    },
};

// function for the suffix
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

// function for abadge selection
function addBadges(badgeNames) {
    if (!badgeNames.length) return [":x:"];
    const badgeMap = {
        ActiveDeveloper: "<:activedeveloper:1269222783649447967>",
        BugHunterLevel1: "<:discordbughunter1:1269222715823226930>",
        BugHunterLevel2: "<:discordbughunter2:1269222364483162173>",
        PremiumEarlySupporter: "<:discordearlysupporter:1269222434280701982>",
        Partner: "<:discordpartner:1269222496003952671>",
        Staff: "<:discordstaff:1269222528841154590>",
        HypeSquadOnlineHouse1: "<:hypesquadbravery:1269222627130478674>", // bravery
        HypeSquadOnlineHouse2: "<:hypesquadbrilliance:1269222685494214726>", // brilliance
        HypeSquadOnlineHouse3: "<:hypesquadbalance:1269222578707365928>", // balance
        Hypesquad: "<:hypesquadevents:1269222889387987036>",
        CertifiedModerator: "<:discordmod:1269222454665154561>",
        VerifiedDeveloper: "<:discordbotdev:1269222739944800328>",
    };

    return badgeNames.map((badgeName) => badgeMap[badgeName] || "❔");
}

/*execute: async (client, interaction) => {
        const user = interaction.options.getUser("member") || interaction.user;
        const User = interaction.guild.members.cache.get(user.id);

        let Roles = User.roles.cache;

        let info1 = new EmbedBuilder()
            .setTitle("General Information")
            .setThumbnail(
                `${user.avatarURL({
                    dynamic: true,
                    size: 4096,
                })}`
            )
            .setDescription(
                `**🪧 Name : ${User.displayName} | ${user}\n🏷️ Tag : __${user.tag}__\n🆔 ID : __${user.id}__**`
            )
            .addFields(
                {
                    name: "Joined Server",
                    value: `${moment(User.joinedAt).format(
                        "dddd, MMMM Do YYYY, h:mm:ss A"
                    )}\n** - ${moment(User.joinedAt, "YYYYMMDD").fromNow()}**`,
                },
                {
                    name: "Joined Discord",
                    value: `${moment(user.createdAt).format(
                        "dddd, MMMM Do YYYY, h:mm:ss A"
                    )}\n** - ${moment(user.createdAt, "YYYYMMDD").fromNow()}**`,
                }
            );

        let info2 = new EmbedBuilder()
            .setTitle(`Roles [${Roles.size - 1}]`)
            .setDescription(
                `**${User.roles.cache
                    .map((r) => r)
                    .join("\n")
                    .replace("@everyone", " ")}**`
            );

        axios
            .get(`https://discord.com/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`,
                },
            })
            .then((res) => {
                const {
                    id,
                    discriminator,
                    avatar,
                    banner,
                    accent_color,
                    username,
                    banner_color,
                } = res.data;

                if (banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;

                    info1.setColor(User.displayHexColor).setImage(url);
                    info2.setColor(User.displayHexColor);

                    interaction.reply({
                        embeds: [info1, info2],
                    });
                } else if (banner_color) {
                    info1.setColor(banner_color);
                    info2.setColor(banner_color);

                    interaction.reply({
                        embeds: [info1, info2],
                    });
                } else {
                    info1.setColor(User.displayHexColor);
                    info2.setColor(User.displayHexColor);

                    interaction.reply({
                        embeds: [info1, info2],
                    });
                }
            });
    },*/

/*
execute: async (interaction, client) => {
    const user = interaction.options.getUser("user") || interaction.user;
    const User = interaction.guild.members.cache.get(user.id);

    let Roles = User.roles.cache;

    let info1 = new EmbedBuilder()
        .setTitle("General Information")
        .setThumbnail(
            `${user.avatarURL({
                dynamic: true,
                size: 4096,
            })}`
        )
        .setDescription(
            `**🪧 Name : ${User.displayName} | ${user}\n🏷️ Tag : __${user.tag}__\n🆔 ID : __${user.id}__**`
        )
        .addFields(
            {
                name: "Joined Server",
                value: `${moment(User.joinedAt).format(
                    "dddd, MMMM Do YYYY, h:mm:ss A"
                )}\n** - ${moment(User.joinedAt, "YYYYMMDD").fromNow()}**`,
            },
            {
                name: "Joined Discord",
                value: `${moment(user.createdAt).format(
                    "dddd, MMMM Do YYYY, h:mm:ss A"
                )}\n** - ${moment(user.createdAt, "YYYYMMDD").fromNow()}**`,
            }
        );

    let info2 = new EmbedBuilder()
        .setTitle(`Roles [${Roles.size - 1}]`)
        .setDescription(
            `**${User.roles.cache
                .map((r) => r)
                .join("\n")
                .replace("@everyone", " ")}**`
        );

    axios
        .get(`https://discord.com/api/users/${user.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`,
            },
        })
        .then((res) => {
            const {
                id,
                discriminator,
                avatar,
                banner,
                accent_color,
                username,
                banner_color,
            } = res.data;

            if (banner) {
                const extension = banner.startsWith("a_") ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;

                info1.setColor(User.displayHexColor).setImage(url);
                info2.setColor(User.displayHexColor);

                interaction.reply({
                    embeds: [info1, info2],
                });
            } else if (banner_color) {
                info1.setColor(banner_color);
                info2.setColor(banner_color);

                interaction.reply({
                    embeds: [info1, info2],
                });
            } else {
                info1.setColor(User.displayHexColor);
                info2.setColor(User.displayHexColor);

                interaction.reply({
                    embeds: [info1, info2],
                });
            }
        });
};
*/

/**
 * const DiscordArtsError = require("./error.utils");
const BASE_URL = "https://discord-arts.asure.dev/v1/user";
const fetch = require("node-fetch").default;
const fs = require("fs");
const { FetchError } = require("node-fetch");
const path = require("path");

async function fetchUserData(userId) {
  const packageJsonPath = path.join(__dirname, "..", "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const version = packageJson.version;

  const errorInfo = { userId };

  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      headers: {
        "x-darts-version": version,
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      if (contentType?.includes("text/html")) {
        throw new DiscordArtsError(
          "API is currently down, try again later",
          errorInfo
        );
      } else {
        throw new DiscordArtsError(
          "Invalid response format. Expected JSON, but received: " +
            contentType,
          errorInfo
        );
      }
    }

    const json = await response.json();
    if (json.error || !response.ok) {
      throw new DiscordArtsError(json?.message, errorInfo);
    }

    return json.data;
  } catch (error) {
    if (error instanceof FetchError) {
      throw new DiscordArtsError(
        "API is currently down, try again later",
        errorInfo
      );
    } else {
      throw new DiscordArtsError(
        error?.message || "API is currently down, try again later",
        errorInfo
      );
    }
  }
}

module.exports = fetchUserData;

 */
