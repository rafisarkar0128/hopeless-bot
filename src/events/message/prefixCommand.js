const { Message } = require("discord.js");
const { commandHandler, automodHandler, statsHandler } = require("@handlers/index");
const { getSettings } = require("@root/src/database/schemas/guild");

/** @type {import("@types/events").EventStructure} */
module.exports = {
  name: "messageCreate",
  once: false,
  rest: false,
  ws: false,
  moonlink: false,
  /** @param {Message} message */
  async execute(client, message) {
    const { config, commands, aliases } = client;
    const { author, guild } = message;

    if (author.bot) return;
    const settings = await getSettings(guild);

    let isCommand = false;

    if (config.commands.prefix.enabled) {
      if (message.content && message.content.startsWith(settings.prefix)) {
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
        const name = args.shift().toLowerCase();
        const command = commands.get(name) || commands.get(aliases.get(name));

        if (command) {
          isCommand = true;
          commandHandler.handlePrefixCommand(client, message, command, settings);
        }
      }
    }

    // stats handler
    //if (settings.stats.enabled) {
    //  await statsHandler.trackMessageStats(message, isCommand, settings);
    //}

    // if not a command
    //if (!isCommand) await automodHandler.performAutomod(message, settings);
  },
};
