const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { t } = require("i18next");

/** @type {import("@structures/command.d.ts").CommandStructure} */
module.exports = {
  options: {
    category: "development",
    cooldown: 0,
    premium: false,
    guildOnly: true,
    devOnly: true,
    voiceChannelOnly: false,
    botPermissions: [
      "SendMessages",
      "ReadMessageHistory",
      "ManageGuild",
      "ManageGuildExpressions",
    ],
    userPermissions: ["SendMessages"],
  },
  prefix: {
    name: "emit",
    description: "Emit an Event",
    aliases: ["emt", "event"],
    usage: "<Event>",
    disabled: true,
    minArgsCount: 0,
    subcommands: [],
    execute: (client, message, args, data) => {},
  },
  slash: {
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
              value: "guildMemberAdd",
            },
            {
              name: "guildMemberRemove",
              value: "guildMemberRemove",
            },
          ),
      )
      .addUserOption((option) =>
        option.setName("member").setDescription("Select a member.").setRequired(false),
      ),
    usage: "[event]: <Event>",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction) => {
      const member = interaction.options.getMember("member") || interaction.member;
      const string = interaction.options.getString("event");

      switch (string) {
        case "guildMemberAdd":
          {
            client.emit("guildMemberAdd", member);
          }
          break;
        case "guildMemberRemove":
          {
            client.emit("guildMemberRemove", member);
          }
          break;
      }

      return interaction.reply({
        content: t("commands:emit.reply", { event: string }),
        ephemeral: true,
      });
    },
  },
};
