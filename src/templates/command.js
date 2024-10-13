const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder(),
  ephemeral: true,
  cooldown: 0,
  category: "NONE",
  usage: {
    prefix: "",
    slash: "",
  },
  aliases: [],
  minArgsCount: 0,
  isPrefixDisabled: false,
  isSlashDisabled: false,
  isPremium: false,
  isGlobal: true,
  isGuildOnly: false,
  isDevOnly: false,
  isVoiceChannelOnly: false,
  botPermissions: [],
  userPermissions: [],
  run: (client, message, args, data) => {},
  execute: (client, interaction, data) => {},
};
