const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder,
    SlashCommandBuilder,
} = require("discord.js");
const { profileImage } = require("discord-arts");
const {
    addSuffix,
    addBadges,
    getJoinedPosition,
} = require("../../utils/user.utils.js");
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
        ).toFormat(
            "dd/LL/yyyy h:mm:ss"
        )} (${DateTime.fromMillis(member.joinedTimestamp).toRelativeCalendar()})`;

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
