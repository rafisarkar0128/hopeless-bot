/**
 * @typedef {Object} Options
 * @property {string[]} [aliases]
 * @property {number} [minArgsCount=0]
 * @property {SubCommand} [subcommands=[]]
 */

/**
 * @typedef {Object} SubCommand
 * @property {string} trigger
 * @property {string} description
 */

/**
 * @typedef {"ADMIN"|"ANIME"|"AUTOMOD"|"ECONOMY"|"FUN"|"IMAGE"|"INFORMATION"|"INVITE"|"MODERATION"|"MUSIC"|"TEST"|"NONE"|"OWNER"|"SOCIAL"|"SUGGESTION"|"TICKET"|"UTILITY"} CommandCategory
 */

/**
 * @typedef {Object} CommandStructure
 * @property {import("discord.js").SlashCommandBuilder} data
 * @property {Options} options
 * @property {string} [usage=""]
 * @property {number} cooldown
 * @property {CommandCategory} category
 * @property {boolean} premium
 * @property {import('discord.js').PermissionResolvable[]} [botPermissions]
 * @property {import('discord.js').PermissionResolvable[]} [userPermissions]
 * @property {function(import("./DiscordBot.js").DiscordBot, import('discord.js').Message, string[], object)} run
 * @property {function(import("./DiscordBot.js").DiscordBot, import('discord.js').ChatInputCommandInteraction, object)} execute
 */

/**
 * @type {CommandStructure}
 */
module.exports = {
    data: {},
    options: {
        aliases: [],
        minArgsCount: 0,
        subcommands: [],
    },
    usage: "",
    cooldown: 0,
    category: "NONE",
    premium: false,
    botPermissions: [],
    userPermissions: [],
    run: async (client, message, args, data) => {},
    execute: async (client, interaction, data) => {},
};
