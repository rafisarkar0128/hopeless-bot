const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  name: "emit",
  description: "Emit an Event",
  cooldown: 0,
  category: "NONE",
  isPremium: false,
  isGlobal: true,
  isGuildOnly: true,
  isDevOnly: true,
  isVoceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  prefixCommand: {
    enabled: true,
    aliases: ["emt", "event"],
    usage: "[event] <Event>",
    minArgsCount: 1,
    subcommands: [],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    usage: "/emit [event] <Event>",
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
  },
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
