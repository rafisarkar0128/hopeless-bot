const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
  data: new SlashCommandBuilder(),
  aliases: [],
  usage: "",
  cooldown: 0,
  category: "NONE",
  disabled: false,
  global: true,
  guildOnly: false,
  devOnly: false,
  inVoiceChannel: false,
  botPermissions: [],
  userPermissions: [],
  run: async (client, message, args) => {},
  execute: async (client, interaction) => {},
};
