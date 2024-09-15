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
 * @property {string[]} [aliases]
 * @property {string} [usage=""]
 * @property {number} [minArgsCount=0]
 *
 * @property {number} cooldown
 * @property {CommandCategory} category
 * @property {boolean} premium
 *
 * @property {import('discord.js').PermissionResolvable[]} [botPermissions]
 * @property {import('discord.js').PermissionResolvable[]} [userPermissions]
 * @property {Validation[]} [validations]
 *
 * @property {boolean} enabled
 * @property {boolean} server
 *
 * @property {function(import('discord.js').Message, string[], object)} run
 * @property {function(import('discord.js').ChatInputCommandInteraction, object)} execute
 */

/**
 * @type {CommandStructure}
 */
module.exports = {
  data: {},
  aliases: [],
  usage: "",
  minArgsCount: 0,
  subcommands: [],

  cooldown: 0,
  category: "NONE",
  premium: false,

  botPermissions: [],
  userPermissions: [],

  enabled: true,
  server: true,

  run: (client, message, args, ...optional) => {},
  execute: (client, interaction, data, ...optonal) => {},
};
