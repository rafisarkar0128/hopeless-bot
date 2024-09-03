const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const { profileImage } = require("discord-arts");
const { DateTime } = require("luxon");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("memberinfo")
        .setDescription("📖 View your or any member's information.")
        .setDMPermission(true)
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription(
                    "Select a member or leave empty to view your own info."
                )
                .setRequired(false)
        ),
    category: "server",
    usage: "/memberinfo [member]",
    cooldown: 20,
    userPermissions: [],
    botPermissions: [],
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {
        await interaction.deferReply();

        const member =
            interaction.options.getMember("member") || interaction.member;

        const banner = (await member.user.fetch()).bannerURL({
            size: 4096,
        });
        const avatar = member.user.displayAvatarURL({
            size: 4096,
        });

        const profileBuffer = await profileImage(member.id, {
            customBackground: banner
                ? ""
                : `${process.cwd()}/public/assets/blured.jpg`,
            usernameColor: client.colors.americanRose,
            tagColor: client.colors.powderBlue,
        });
        const imageAttachment = new AttachmentBuilder(profileBuffer, {
            name: "profile.png",
        });

        const joinTime = `${DateTime.fromMillis(
            member.joinedTimestamp
        ).toFormat("dd/LL/yyyy h:mm:ss")} (${DateTime.fromMillis(
            member.joinedTimestamp
        ).toRelativeCalendar()})`;

        const creationTime = `${DateTime.fromMillis(
            member.user.createdTimestamp
        ).toFormat("dd/LL/yyyy h:mm:ss")} (${DateTime.fromMillis(
            member.user.createdTimestamp
        ).toRelativeCalendar()})`;

        const Booster = member.premiumSince
            ? `Since ${DateTime.fromMillis(
                  member.premiumSinceTimestamp
              ).toFormat("LLLL dd, yyyy")}`
            : "No";

        const embed = new EmbedBuilder()
            .setTitle("General Information")
            .setColor(member.displayHexColor || client.colors.azure)
            .setDescription(
                `On <t:${parseInt(member.joinedTimestamp / 1000)}:D> <@${
                    member.id
                }> joind as the **${addSuffix(
                    await getJoinedPosition(interaction, member.id)
                )}** member of this server.`
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
                }
            )
            .setFooter({
                text: `Powered by ${client.user.username}`,
            });

        return interaction.followUp({
            embeds: [embed],
            files: [imageAttachment],
        });
    },
};

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

async function getJoinedPosition(interaction, id) {
    let guildMembers = await interaction.guild.members.fetch();
    let position =
        Array.from(
            guildMembers
                .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
                .keys()
        ).indexOf(id) + 1;
    return position;
}
