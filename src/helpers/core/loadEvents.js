const chalk = require("chalk");
const { table } = require("table");
const { loadFiles } = require("@utils/index.js");
const path = require("path");

/**
 * A function to load event files
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 * @example await client.loadEvents();
 */
async function loadEvents(client) {
  if (!client || typeof client !== "object") {
    throw new Error("Client is not defined or not an object.");
  }

  if (client.config.bot.debug) {
    client.logger.debug(
      `Loading event modules from ${chalk.cyan(path.join(process.cwd(), "src", "events"))}`
    );
  }

  const { Events } = client.resources;
  const files = await loadFiles("src/events", [".js"]);
  let i = 0;
  let disabledCount = 0;
  let errorCount = 0;

  // Pre-calculate the maximum filename length for consistent formatting
  const maxFileNameLength = Math.max(...files.map((f) => path.basename(f).length), 12);

  // Enhanced table headers with colors
  const tableData = [
    [
      chalk.bold.cyan("Event Name"),
      chalk.bold.cyan("Target"),
      chalk.bold.cyan("Status"),
      chalk.bold.cyan("Once"),
    ],
  ];
  /**
   * Typings for table config.
   * @type {import("table").TableUserConfig}
   */
  const tableConfig = {
    columnDefault: {
      alignment: "center",
      width: 15,
    },
    border: client.utils.getTableBorder("yellow"),
    drawHorizontalLine: (lineIndex, rowCount) => {
      return (
        lineIndex === 0 ||
        lineIndex === 1 ||
        lineIndex === 2 ||
        lineIndex === rowCount ||
        lineIndex === rowCount - 1
      );
    },
    columns: [
      { alignment: "left", width: maxFileNameLength }, // Event Name
      { width: 12 }, // Target
      { width: 10 }, // Status
      { width: 8 }, // Once
    ],
    header: {
      alignment: "center",
      content: chalk.bold.yellow(
        "EVENT FILES\nHere is the list of all event files loaded into the bot."
      ),
    },
    spanningCells: [{ col: 0, row: files.length + 1, colSpan: 4, alignment: "center" }],
  };

  for (const file of files) {
    const fileName = path.basename(file);
    try {
      const Event = require(file);
      /**
       * BaseEvent structure for auto completion
       * @type {import("@src/structures").BaseEvent}
       */
      const event = new Event();

      // skipping disabled events.
      if (event.disabled) {
        disabledCount++;
        if (client.config.showTable.event) {
          tableData.push([
            chalk.gray(event.name || fileName),
            chalk.gray("N/A"),
            chalk.gray(" DISABLED "),
            chalk.gray("N/A"),
          ]);
        }
        continue;
      }

      // checking for event name and type
      if (!event.name || typeof event.name !== "string") {
        throw new TypeError(`Event name must be a string.`);
      }

      // checking name's validity
      if (!Events.includes(event.name)) {
        throw new Error(`"${event.name}" is not valid event name.`);
      }

      const target =
        event.rest ? chalk.magenta("REST")
        : event.ws ? chalk.white("WS")
        : event.player ? chalk.red("Player")
        : event.node ? chalk.green("Node")
        : chalk.cyan("Client");

      const targetObj =
        event.rest ? client.rest
        : event.ws ? client.ws
        : event.player ? client.lavalink
        : event.node ? client.lavalink.nodeManager
        : client;

      const execute = (...args) => event.execute(client, ...args);
      targetObj[event.once ? "once" : "on"](event.name, execute);

      i++;
      if (client.config.showTable.event) {
        tableData.push([
          event.name,
          target,
          chalk.green(" LOADED "),
          event.once ? chalk.green("✓") : chalk.red("✗"),
        ]);
      }
    } catch (error) {
      errorCount++;

      // Always show a simple error message
      client.logger.error(`Failed to load event ${fileName}`);

      // Show detailed error only in debug mode
      if (client.config.bot.debug) {
        client.logger.error(`Detailed error for ${fileName}:\n`, error);
      }

      if (client.config.showTable.event) {
        tableData.push([
          chalk.red(fileName),
          chalk.gray("N/A"),
          chalk.red(" ERROR "),
          chalk.gray("N/A"),
        ]);
      }
    }
  }

  if (client.config.showTable.event) {
    // Add summary row - all values must be strings, not objects
    const summary = `${chalk.bold("SUMMARY")}: Total: ${chalk.white(files.length)}, Loaded: ${chalk.green(i)}, Errors: ${chalk.red(errorCount)}, Disabled: ${chalk.gray(disabledCount)}`;

    tableData.push([summary, "", "", ""]);
    console.log(table(tableData, tableConfig));
  }

  // Enhanced final log message with colors
  const statusMessage = errorCount > 0 ? chalk.red("with errors") : chalk.green("successfully");

  client.logger.info(
    `Loaded ${chalk.yellow(i)} events ${statusMessage}. ` +
      `(${chalk.gray(disabledCount)} disabled, ${chalk.red(errorCount)} errors)`
  );
}

module.exports = { loadEvents };
