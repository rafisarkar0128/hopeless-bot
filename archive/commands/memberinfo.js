// Part of memberinfo | userinfo command.

const response = await axios.get(
    `https://discord-arts.asure.dev/v1/user/${member.id}`,
    {
        headers: {
            "x-darts-version": "0.6.1",
        },
    }
);
//console.log(response.data);

const User = await axios.get(`https://discord.com/api/v10/users/${member.id}`, {
    headers: {
        Authorization: `Bot ${client.token}`,
    },
});
console.log(User.data);
console.log(member.user.flags.toArray());

const Discord_Employee = 1;
const Partnered_Server_Owner = 2;
const HypeSquad_Events = 4;
const Bug_Hunter_Level_1 = 8;
const House_Bravery = 64;
const House_Brilliance = 128;
const House_Balance = 256;
const Early_Supporter = 512;
const Bug_Hunter_Level_2 = 16384;
const Early_Verified_Bot_Developer = 131072;

const flags = User.data.flags;

if ((flags & Discord_Employee) == Discord_Employee) {
    var badge_Discord_Employee = "true";
} else {
    var badge_Discord_Employee = "false";
}

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
