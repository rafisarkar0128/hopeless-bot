const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emit an Event")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("The event to emit")
        .setRequired(true)
        .setChoices(
          {
            name: "guildMemberAdd",
            value: "gadd",
          },
          {
            name: "guildMemberRemove",
            value: "gremove",
          },
        ),
    )
    .addUserOption((option) =>
      option.setName("member").setDescription("Select a member.").setRequired(false),
    ),
  ephemeral: true,
  cooldown: 0,
  category: "DEVELOPMENT",
  usage: {
    prefix: "[<Event>]",
    slash: "/emit [event]: <Event>",
  },
  aliases: ["emt", "event"],
  minArgsCount: 1,
  isPrefixDisabled: true,
  isSlashDisabled: false,
  isPremium: false,
  isGlobal: true,
  isGuildOnly: true,
  isDevOnly: true,
  isVoiceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  //run: async (client, message, args) => {},
  execute: async (client, interaction) => {
    const member = interaction.options.getMember("member") || interaction.member;
    const string = interaction.options.getString("event");

    switch (string) {
      case "gadd":
        {
          client.emit("guildMemberAdd", member);
        }
        break;
      case "gremove":
        {
          client.emit("guildMemberRemove", member);
        }
        break;
    }

    return interaction.reply({
      content: "Emitted the selected event successfully.",
      ephemeral: true,
    });
  },
};
