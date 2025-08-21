const {
  ContextMenuCommandBuilder,
  ApplicationCommandType
} = require("discord.js");

/** @type {import("@types/index").ContextStructure} */
module.exports = {
  data: new ContextMenuCommandBuilder().setType(
    ApplicationCommandType.User || ApplicationCommandType.Message // either message or user
  ),
  category: "none",
  cooldown: 0,
  global: true,
  premium: false,
  devOnly: false,
  disabled: false,
  ephemeral: true,
  botPermissions: [],
  userPermissions: [],
  async execute(client, interaction, lng) {}
};
