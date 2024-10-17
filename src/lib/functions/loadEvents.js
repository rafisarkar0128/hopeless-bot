const colors = require("colors");
const { table } = require("table");
const loadFiles = require("./loadFiles");

/**
 * A function to load event files
 * @type {import("./functions").LoadEvents}
 */
module.exports = async (client, dir) => {
  const debug = client.config.console.debug.event;

  /** @type {Array<{file: string, error: Error}>} */
  const errors = new Array();
  const files = await loadFiles(dir, [".js"]);
  const tableData = [["Index".cyan, "Events".cyan, "File".cyan, "Status".cyan]];
  client.events.clear();
  let i = 0;

  for (const file of files) {
    const fileName = file.replace(/\\/g, "/").split("/").pop();

    try {
      /** @type {import("@structures/event").EventStructure} */
      const event = require(file);
      client.events.set(fileName, event);

      const execute = (...args) => event.execute(client, ...args);
      const target = event.rest
        ? client.rest
        : event.ws
        ? client.ws
        : event.lavalink
        ? client.lavalink
        : client;
      target[event.once ? "once" : "on"](event.name, execute);

      i++;
      tableData.push([`${colors.blue(i)}`, event.name.yellow, fileName.green, "» 🌱 «"]);
    } catch (error) {
      i++;
      tableData.push([`${colors.blue(i)}`, "unknown".yellow, fileName.red, "» 🔴 «"]);
      errors.push({ file: file, error: error });
    }
  }

  if (debug) console.log(createTable(tableData));

  if (errors.length > 0) {
    console.log(
      colors.yellow(
        "[AntiCrash] | [Event_Loader_Error_Logs] | [Start] : ===============",
      ),
    );
    errors.forEach((e) => {
      console.log(e.file.yellow, "\n", colors.red(e.error), "\n");
    });
    console.log(
      colors.yellow("[AntiCrash] | [Event_Loader_Error_Logs] | [End] : ==============="),
    );
  }

  return client.logger.info(`loaded ${colors.yellow(client.events.size)} event modules`);
};

/**
 * A function to create a table for console log with predefined configuration
 * @param {Array} data
 * @returns {string}
 */
function createTable(data, header) {
  /**
   * @type {import("table").TableUserConfig}
   */
  const config = {
    columnDefault: {
      alignment: "center",
      width: 30,
    },
    columns: [{ width: 6 }, {}, {}, { width: 6 }],
    border: {
      topBody: `─`.yellow,
      topJoin: `┬`.yellow,
      topLeft: `┌`.yellow,
      topRight: `┐`.yellow,

      bottomBody: `─`.yellow,
      bottomJoin: `┴`.yellow,
      bottomLeft: `└`.yellow,
      bottomRight: `┘`.yellow,

      bodyLeft: `│`.yellow,
      bodyRight: `│`.yellow,
      bodyJoin: `│`.yellow,

      joinBody: `─`.yellow,
      joinLeft: `├`.yellow,
      joinRight: `┤`.yellow,
      joinJoin: `┼`.yellow,
    },
    drawHorizontalLine: (lineIndex, rowCount) => {
      return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
    },
  };

  return table(data, config);
}
