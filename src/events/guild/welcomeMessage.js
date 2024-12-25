const { GuildMember } = require("discord.js");
//const { WelcomeLeave } = require("canvafy");
const welcomeSchema = require("@src/schemas/welcome.js");

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  name: "guildMemberAdd",
  once: false,
  /**
   * types for parameters
   * @param {GuildMember} member
   * @returns
   */
  execute: async (client, member) => {
    /*
    const data = await welcomeSchema.findOne({
      guildid: member.guild.id,
    });

    if (!data) return;

    const randomBorderColor = getRandomColor();
    const randomAvatarBorderColor = getRandomColor();

    const welcomeImage = await new WelcomeLeave()
      .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
      .setBackground("image", data.imageURL || "")
      .setTitle("Welcome")
      .setDescription("Welcome to this server, go read the rules please!")
      .setBorder(randomBorderColor)
      .setAvatarBorder(randomAvatarBorderColor)
      .setOverlayOpacity(0.3)
      .build();

    member.guild.channels.cache.get(data.channel).send({
      content: data.message
        .replace(/\{mention\}/g, member.user.toString())
        .replace(/\{user\}/g, member.user.username)
        .replace(/\{server\}/g, member.guild.name)
        .replace(/\{members\}/g, member.guild.memberCount),
      files: [
        {
          attachment: welcomeImage,
          name: `welcome-${member.id}.png`,
        },
      ],
    });
    */
  },
};
