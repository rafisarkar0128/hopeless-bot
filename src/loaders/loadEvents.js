const colors = require("colors");
const AsciiTable = require("ascii-table/ascii-table");
const { loadFiles } = require("./loadFiles.js");
const table = new AsciiTable();
table.setHeading("files", "status").setBorder(" ", " ", " ", " ");
/**
 *@param {String} dir - path of events directory
 */
async function loadEvents(client, dir) {
  const files = await loadFiles(dir);
  client.events.clear();

  let i = 0;
  for (const file of files) {
    const event = require(file);
    const execute = (...args) => event.execute(client, ...args);
    const target = event.rest ? client.rest : client;

    client.events.set(event.name, execute);
    target[event.once ? "once" : "on"](event.name, execute);

    table.addRow(file.replace(/\\/g, "/").split("/").pop(), "✅");
    i++;
  }

  await client.logBox(table.toString(), {});
  client.log(colors.yellow(` | loaded ${i} events.`));
}

module.exports = { loadEvents };
