/**
 * This file is dedicated to some old code that was used partly on a command or a function for a command or
 * they might have been a part of some greater code base for a larger command.
 *
 * I am kidding these code are mostly by product of some command or function.
 */

// Part of a code from a command. Part of memberinfo | userinfo command.

const avatarButton = new ButtonBuilder()
    .setLabel("avatar")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`avatar`);

const bannerButton = new ButtonBuilder()
    .setLabel("banner")
    .setStyle(ButtonStyle.Secondary)
    .setCustomId(`banner`);

if (!banner) bannerButton.setDisabled(true);

const actionRow = new ActionRowBuilder()
    .addComponents(avatarButton)
    .addComponents(bannerButton);

const collector = interaction.channel.createMessageComponentCollector({
    time: 60000,
    componentType: ComponentType.Button,
});

collector.on("collect", (b) => {
    collector.resetTimer();

    if (b.customId === "avatar") {
        return b.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.user.username}'s Avatar`)
                    .setColor(member.displayHexColor)
                    .setImage(avatar)
                    .setFooter({
                        text: `Powered by ${client.user.username}`,
                    }),
            ],
            ephemeral: true,
        });
    }

    if (b.customId === "banner") {
        return b.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.user.username}'s Banner`)
                    .setColor(member.displayHexColor)
                    .setImage(banner)
                    .setFooter({
                        text: `Powered by ${client.user.username}`,
                    }),
            ],
            ephemeral: true,
        });
    }
});

collector.on("end", () => {});
