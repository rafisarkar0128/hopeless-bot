const chalk = require("chalk");
const { table } = require("table");
const { loadFiles } = require("@utils/index.js");

/**
 * A function to load event files
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 * @example await client.loadEvents();
 */
async function loadEvents(client) {
  if (typeof client !== "object") {
    throw new TypeError(`Parameter (${chalk.yellow("client")}) must be an object.`);
  }

  const tableData = [["Event", "Status"]];
  /**
   * Typings for table config.
   * @type {import("table").TableUserConfig}
   */
  const tableConfig = {
    columnDefault: {
      alignment: "center",
    },
    border: client.utils.getTableBorder("yellow"),
    drawHorizontalLine: (lineIndex, rowCount) => {
      return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
    },
    columns: [{ alignment: "left" }, { width: 6 }],
  };
  const { Events } = client.resources;
  const files = await loadFiles("src/events", [".js"]);
  let i = 0;

  for (const file of files) {
    const filePath = `${chalk.yellow("filePath")} => ${chalk.yellow(file)}`;
    try {
      const Event = require(file);
      /**
       * BaseEvent structure for auto completion
       * @type {import("@src/structures").BaseEvent}
       */
      const event = new Event();

      // skipping disabled events.
      if (event.disabled) continue;

      // checking for event name and type
      if (!event.name || typeof event.name !== "string") {
        throw new TypeError(`Event name must be a string.`);
      }

      // checking name's validity
      if (!Events.includes(event.name)) {
        throw new Error(`"${event.name}" is not valid event name.`);
      }

      const target =
        event.rest ? client.rest
        : event.ws ? client.ws
        : event.lavalink ? client.lavalink
        : event.node ? client.lavalink.nodeManager
        : client;
      const execute = (...args) => event.execute(client, ...args);
      target[event.once ? "once" : "on"](event.name, execute);

      i++;
      tableData.push([chalk.yellow(event.name), "» 🌱 «"]);
    } catch (error) {
      client.logger.error(error);
      console.log(filePath);
      tableData.push([chalk.red(file.split(/[\\|/]/g).pop()), "» 🔴 «"]);
    }
  }

  if (client.config.showTable.event) {
    console.log(table(tableData, tableConfig));
  }
  client.logger.info(`Loaded ${chalk.yellow(i)} events successfully.`);
}

module.exports = { loadEvents };
