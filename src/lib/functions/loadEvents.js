const colors = require("colors");
const { table } = require("table");
const { t } = require("i18next");
const loadFiles = require("./loadFiles.js");
const { Events } = require("./validations/events.js");

/**
 * A function to load event files
 * @type {import("./functions").LoadEvents}
 * @example await loadEvents(client, "src/events");
 */
module.exports = async (client, dir) => {
  if (typeof dir !== "string") {
    throw new TypeError("Value of dir must a string with valid path");
  }

  client.logger.info(t("console:loaders.event.start", { dir: colors.green(dir) }));

  const debug = client.config.console.debug.event_table;
  const tableData = [["Index".cyan, "Event".cyan, "File".cyan, "Status".cyan]];
  /**
   * @type {import("table").TableUserConfig}
   */
  const tableConfig = {
    columnDefault: {
      alignment: "center",
      width: 26,
    },
    columns: [{ width: 5 }, {}, {}, { width: 6 }],
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

  /**
   * @type {Array<{file: string, error: Error}>}
   */
  const errors = new Array();
  const files = await loadFiles(dir, [".js"]);
  client.events.clear();

  let i = 0,
    l = 0;
  for (const file of files) {
    const fileName = file.replace(/\\/g, "/").split("/").pop();

    /**
     * @type {import("@structures/event").EventStructure}
     */
    const event = require(file);
    try {
      if (!Events.includes(event.name) || !event.name) {
        throw new Error(t("errors:validations.event.name"));
      }
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

      i++ && l++;
      tableData.push([
        `${colors.magenta(i)}`,
        event.name.yellow,
        fileName.green,
        "» 🌱 «",
      ]);
    } catch (error) {
      i++;
      tableData.push([`${colors.magenta(i)}`, event.name.yellow, fileName.red, "» 🔴 «"]);
      errors.push({ file: file, error: error });
    }
  }

  if (debug) console.log(table(tableData, tableConfig));

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

  return client.logger.info(t("console:loaders.event.end", { size: colors.yellow(l) }));
};
