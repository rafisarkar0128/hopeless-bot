// Command Structure

const { SlashCommandBuilder } = require("discord.js");

/** @type {import("@src/index").CommandStructure} */
module.exports = {
    data: new SlashCommandBuilder(),
    aliases: [],
    minArgsCount: 0,
    usage: "",
    cooldown: 0,
    category: "NONE",
    premium: false,
    disabled: false,
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {},
};

// Event Structure

/**
 * @type {import("@src/index").EventStructure}
 */
module.exports = {
    name: "",
    once: false,
    rest: false,
    execute: async (client, ...args) => {},
};

// ContextMenu Structure

const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");

/** @type {import("@src/index").ContextMenuStructure} */
module.exports = {
    data: ContextMenuCommandBuilder(),
    cooldown: 0,
    category: "NONE",
    premium: false,
    disabled: false,
    global: true,
    guildOnly: false,
    devOnly: false,
    botPermissions: [],
    userPermissions: [],
    execute: async (client, interaction, data) => {},
};
