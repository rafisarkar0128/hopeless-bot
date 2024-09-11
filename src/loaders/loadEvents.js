const colors = require("colors");
const loadFiles = require("./loadFiles.js");

/**
 *@param {import("../structures/DiscordBot.js").DiscordBot} client - base client
 *@param {String} dir - path of events directory
 */
module.exports = async (client, dir) => {
  const files = await loadFiles(dir);
  client.events.clear();

  let i = 0;
  for (const file of files) {
    try {
      const event = require(file);
      const execute = (...args) => event.execute(client, ...args);
      const target = event.rest ? client.rest : client;

      client.events.set(event.name, execute);

      try {
        target[event.once ? "once" : "on"](event.name, execute);
      } catch (error) {
        throw error;
      }

      i++;
    } catch (error) {
      client.logger.error(error);
    }
  }

  client.logger.log(colors.yellow(`loaded ${i} events.`));
};
