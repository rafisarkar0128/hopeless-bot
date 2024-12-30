const colors = require("colors");
const { table } = require("table");
const { t } = require("i18next");
const { loadFiles } = require("./loadFiles.js");
const { Events } = require("./validations/events.js");

/**
 * A function to load event files
 * @type {import("./helpers.d.ts").LoadEvents}
 * @example await loadEvents(client, "src/events");
 */
async function loadEvents(client, dir) {
  if (typeof client !== "object") {
    throw new TypeError(
      t("errors:missing_parameter", { param: colors.yellow("client") }),
    );
  }

  if (typeof dir !== "string") {
    throw new TypeError(t("errors:type.string", { param: colors.yellow("dir") }));
  }

  client.logger.info(
    __filename,
    t("default:loader.event.start", { dir: colors.green(dir) }),
  );

  const tableData = [
    [
      colors.cyan("Index"),
      colors.cyan("Event"),
      colors.cyan("File"),
      colors.cyan("Status"),
    ],
  ];

  /**
   * @type {import("table").TableUserConfig}
   */
  const tableConfig = {
    columnDefault: {
      alignment: "center",
      width: 26,
    },
    columns: [{ width: 5 }, {}, {}, { width: 6 }],
    border: client.utils.getTableBorder("yellow"),
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
    const filename = file.split(/[\\/]/g).pop();

    /**
     * @type {import("@structures/event").EventStructure}
     */
    const event = require(file);
    try {
      if (!Events.includes(event.name) || !event.name) {
        throw new Error(t("errors:validations.event.name"));
      }

      client.events.set(filename, event);
      const execute = (...args) => event.execute(client, ...args);
      const target = event.rest
        ? client.rest
        : event.ws
        ? client.ws
        : event.player
        ? client.lavalink
        : event.node
        ? client.lavalink.nodeManager
        : client;

      target[event.once ? "once" : "on"](event.name, execute);

      i++;
      l++;
      tableData.push([
        `${colors.magenta(i)}`,
        colors.yellow(event.name),
        colors.green(filename),
        "» 🌱 «",
      ]);
    } catch (error) {
      i++;
      tableData.push([
        `${colors.magenta(i)}`,
        colors.red(event.name),
        colors.red(filename),
        "» 🔴 «",
      ]);
      errors.push({ file: file, error: error });
    }
  }

  if (client.config.table.event) console.log(table(tableData, tableConfig));

  if (errors.length > 0) {
    console.log(colors.yellow(t("errors:loader.event.start")));
    errors.forEach((e) => {
      console.log(colors.green(e.file), "\n", colors.red(e.error), "\n");
    });
    console.log(colors.yellow(t("errors:loader.event.end")));
  }

  client.logger.info(__filename, t("default:loader.event.end", { l: colors.yellow(l) }));
}

module.exports = { loadEvents };
