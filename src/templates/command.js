const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  name: "",
  description: "",
  cooldown: 0,
  category: "NONE",
  isPremium: false,
  isGlobal: true,
  isGuildOnly: false,
  isDevOnly: false,
  isVoceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  prefixCommand: {
    enabled: true,
    aliases: [],
    usage: "",
    minArgsCount: 0,
    subcommands: [],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    usage: "",
    data: new SlashCommandBuilder(),
  },
  run: async (client, message, args, data) => {},
  execute: async (client, interaction, data) => {},
};
