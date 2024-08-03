// variables
const {
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder,
    UserFlagsBitField,
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
