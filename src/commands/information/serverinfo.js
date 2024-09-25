const { EmbedBuilder, SlashCommandBuilder, ChannelType } = require("discord.js");
const { DateTime } = require("luxon");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("📖 View the server information."),
    aliases: [],
    minArgsCount: 0,
    usage: "/info member | {prefix}serverinfo",
    cooldown: 0,
    category: "NONE",
    premium: false,
    disabled: false,
    global: true,
    guildOnly: true,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {
        try {
            const Guild = await interaction.guild.fetch();
            const Owner = await Guild.fetchOwner();
            const Members = await Guild.members.fetch();
            const Roles = Guild.roles.cache;
            const Channels = Guild.channels.cache;
            const Iconurl = Guild.iconURL();
            const Bannerurl = Guild.bannerURL();
            const Emojis = Guild.emojis.cache;
            const Stickers = Guild.stickers.cache;
            const embed = new EmbedBuilder()
                .setTitle("📝 Server Information")
                .setColor(
                    client.colors.array[
                        Math.floor(Math.random() * client.colors.array.length)
                    ],
                )
                .setThumbnail(Iconurl)
                .setImage(Bannerurl)
                .addFields(
                    {
                        name: "Server Name",
                        value: `\`\`\`\n${Guild.name}\n\`\`\``,
                        inline: true,
                    },
                    {
                        name: "Server ID",
                        value: `\`\`\`\n${Guild.id}\n\`\`\``,
                        inline: true,
                    },
                    {
                        name: `Members [${Members.size}]`,
                        value: `\`\`\`\nMembers: ${
                            Members.filter((m) => m.user.bot === false).size
                        } | Bots: ${
                            Members.filter((m) => m.user.bot === true).size
                        }\n\`\`\``,
                        inline: false,
                    },
                    {
                        name: "Server Owner",
                        value: `<@${Owner.user.id}>`,
                        inline: true,
                    },
                    {
                        name: "Owner ID",
                        value: `\`\`\`\n${Owner.id}\n\`\`\``,
                        inline: true,
                    },
                    {
                        name: `Server Categories and Channels [${Channels.size}]`,
                        value: `\`\`\`\n${await getChannelCountString(Channels)}\n\`\`\``,
                        inline: false,
                    },
                    {
                        name: "Server Boosts",
                        value: `\`\`\`\n${Guild.premiumSubscriptionCount} Boosts\n\`\`\``,
                        inline: true,
                    },
                    {
                        name: "Server Boost Level",
                        value: `\`\`\`\nlevel: ${Guild.premiumTier}\n\`\`\``,
                        inline: true,
                    },
                    {
                        name: `Server Roles [${Roles.size}] (Shows up to 20)`,
                        value: `${Roles.sort((a, b) => {
                            b.position - a.position;
                        })
                            .map((r) => r)
                            .slice(0, 20)
                            .join(" ")}`,
                        inline: false,
                    },
                    {
                        name: `Server Emojis and Stickers [${
                            Emojis.size + Stickers.size
                        }]`,
                        value: `\`\`\`\nNormal: ${
                            Emojis.filter((e) => e.animated === false).size
                        } | Animated: ${
                            Emojis.filter((e) => e.animated === true).size
                        } | Sticker: ${Stickers.size}\n\`\`\``,
                        inline: false,
                    },
                    {
                        name: "Server created on (DD/MM/YYYY)",
                        value: `\`\`\`\n${DateTime.fromMillis(
                            Guild.createdTimestamp,
                        ).toFormat("dd/LL/yy, h:mm:ss a")} (${DateTime.fromMillis(
                            Guild.createdTimestamp,
                        ).toRelativeCalendar()})\n\`\`\``,
                        inline: true,
                    },
                )
                .setFooter({
                    text: `Powered by ${client.user.username}`,
                });

            return interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            throw error;
        }
    },
};

async function getChannelCountString(Channels) {
    const ChannelString = `Categories: ${
        Channels.filter((c) => c.type === ChannelType.GuildCategory).size
    } | Text: ${Channels.filter((c) => c.type === ChannelType.GuildText).size} | Voice: ${
        Channels.filter((c) => c.type === ChannelType.GuildVoice).size
    } | Announcement: ${
        Channels.filter((c) => c.type === ChannelType.GuildAnnouncement).size
    } | Stage: ${
        Channels.filter((c) => c.type === ChannelType.GuildStageVoice).size
    } | Forum: ${
        Channels.filter((c) => c.type === ChannelType.GuildForum).size
    } | Media: ${
        Channels.filter((c) => c.type === ChannelType.GuildMedia).size
    } | Directory: ${Channels.filter((c) => c.type === ChannelType.GuildDirectory).size}`;

    return ChannelString;
}
