// Command Structure

const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@types/commands").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder(),
    aliases: [],
    minArgsCount: 0,
    usage: "",
    cooldown: 0,
    category: "NONE",
    premium: false,
    disabled: { slash: false, prefix: false },
    global: true,
    guildOnly: false,
    devOnly: false,
    inVoice: false,
    botPermissions: [],
    userPermissions: [],
    run: async (client, message, args) => { },
    execute: async (client, interaction,) => { },
};
