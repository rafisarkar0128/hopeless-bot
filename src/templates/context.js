const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

/** @type {import("@types/commands").ContextMenuStructure} */
module.exports = {
  data: new ContextMenuCommandBuilder().setType(
    ApplicationCommandType.User || ApplicationCommandType.Message, // either message or user
  ),
  category: "NONE",
  ephemeral: false,
  cooldown: 0,
  isDisabled: false,
  isPremium: false,
  isGlobal: true,
  isGuildOnly: false,
  isDevOnly: false,
  isVoiceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  execute: (client, interaction, data) => {},
};
