const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const welcomeSchema = require(`@src/schemas/welcome.js`);

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "config",
    cooldown: 0,
    premium: false,
    guildOnly: true,
    devOnly: true,
    voiceChannelOnly: false,
    botPermissions: ["SendMessages", "ReadMessageHistory", "ManageGuild"],
    userPermissions: ["SendMessages", "ReadMessageHistory", "ManageGuild"],
  },
  prefix: {
    name: "welcome",
    description: "Set up a welcome message",
    aliases: [],
    usage: "",
    disabled: true,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder()
      .setName(`welcome`)
      .setDescription(`Set up a welcome message`)
      .addSubcommand((subcommand) =>
        subcommand
          .setName(`set`)
          .setDescription(`Keywords = {mention}, {user}, {server}, {members}`)
          .addChannelOption((option) =>
            option
              .setName(`channel`)
              .setDescription(`The channel to send the welcome message`)
              .setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName(`message`)
              .setDescription(`The message to send`)
              .setRequired(true),
          )
          .addStringOption((option) =>
            option
              .setName(`image`)
              .setDescription(`The URL of the image (optional)`)
              .setRequired(false),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand.setName(`remove`).setDescription(`Deletes the welcome system`),
      ),
    usage: "",
    ephemeral: true,
    global: false,
    disabled: false,
    execute: async (client, interaction, data) => {
      {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
          return await interaction.reply({
            content: `You Need Administrator To Execute This Command!`,
            ephemeral: true,
          });

        if (interaction.options.getSubcommand() === `set`) {
          const data = await welcomeSchema.findOne({
            guildid: interaction.guild.id,
          });

          if (data) {
            const channel = interaction.options.getChannel(`channel`);
            const message = interaction.options.getString(`message`);
            const imageURL = interaction.options.getString(`image`) || data.imageURL; // Use provided image or current data's image

            await welcomeSchema.findOneAndUpdate({
              guildid: interaction.guild.id,
              channel: channel.id,
              message: message,
              imageURL: imageURL,
            });

            await data.save();

            const embed1 = new EmbedBuilder()
              .setColor(`#00FFFF`)
              .setTitle(`Welcome System`)
              .setDescription(
                `Welcome Message Is Updated To ${message} in the channel ${channel}`,
              )
              .setTimestamp();

            await interaction.reply({ embeds: [embed1] });
          }

          if (!data) {
            const channel = interaction.options.getChannel(`channel`);
            const message = interaction.options.getString(`message`);
            const imageURL = interaction.options.getString(`image`) || ""; // Use provided image or an empty string

            const data = await welcomeSchema.create({
              guildid: interaction.guild.id,
              channel: channel.id,
              message: message,
              imageURL: imageURL,
            });

            await data.save();

            const embed = new EmbedBuilder()
              .setColor(`#00FFFF`)
              .setTitle(`Welcome System`)
              .setDescription(
                `Welcome Message Is Set To "${message}" in the channel ${channel}`,
              )
              .setTimestamp();

            await interaction.reply({ embeds: [embed] });
          }
        }

        if (interaction.options.getSubcommand() === `remove`) {
          const data = await welcomeSchema.findOne({
            guildid: interaction.guild.id,
          });

          if (!data) {
            await interaction.reply({
              content: `No Welcome Message Found!`,
              ephemeral: true,
            });
          } else {
            await welcomeSchema.findOneAndDelete({
              guildid: interaction.guild.id,
            });

            const embed3 = new EmbedBuilder()
              .setColor(`Aqua`)
              .setTitle(`Welcome System`)
              .setDescription(`Welcome Message Deleted`);

            await interaction.reply({ embeds: [embed3] });
          }
        }
      }
    },
  },
};
