const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@structures/command.d.ts").CommandStructure} */
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
  prefix: {
    name: "",
    description: "",
    aliases: [],
    usage: "",
    disabled: false,
    minArgsCount: 0,
    subcommands: [],
    execute: async (client, message, args, data) => {},
  },
  slash: {
    data: new SlashCommandBuilder(),
    usage: "",
    ephemeral: true,
    global: true,
    disabled: false,
    execute: async (client, interaction, data) => {},
  },
};
