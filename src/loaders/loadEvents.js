const colors = require("colors");
const AsciiTable = require("ascii-table");
const loadFiles = require("./loadFiles.js");
const table = new AsciiTable();
table.removeBorder().setAlign(1, AsciiTable.RIGHT).setJustify(true);

/**
 *@param {import("../structures/DiscordBot.js").DiscordBot} client - base client
 *@param {String} dir - path of events directory
 */
module.exports = async (client, dir) => {
  client.logger.log(colors.yellow(" | started to load events."));

  const files = await loadFiles(dir);
  client.events.clear();

  let i = 0;
  for (const file of files) {
    try {
      const event = require(file);
      const execute = (...args) => event.execute(client, ...args);
      const target = event.rest ? client.rest : client;

      client.events.set(event.name, execute);
      target[event.once ? "once" : "on"](event.name, execute);

      table.addRow(file.replace(/\\/g, "/").split("/").pop(), "✅");
      i++;
    } catch (error) {
      table.addRow(file.replace(/\\/g, "/").split("/").pop(), "❌");
      client.error(error);
    }
  }

  await client.logBox(table.toString(), {
    borderColor: "#00BFFF",
    stringAlignment: "center",
    padding: {
      left: 5,
      right: 5,
      top: 1,
      bottom: 1,
    },
  });

  client.logger.log(colors.blue(` | loaded ${i} events.`));
};
