const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

/** @type {import("./context.d.ts").ContextMenuStructure} */
module.exports = {
  options: {
    category: "none",
    cooldown: 0,
    premium: false,
    guildOnly: false,
    devOnly: false,
    voiceChannelOnly: false,
    botPermissions: [],
    userPermissions: [],
  },
  context: {
    data: new ContextMenuCommandBuilder().setType(
      ApplicationCommandType.User || ApplicationCommandType.Message, // either message or user
    ),
    ephemeral: true,
    global: true,
    disabled: false,
    execute: (client, interaction, data) => {},
  },
};
