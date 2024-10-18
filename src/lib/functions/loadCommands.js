const colors = require("colors");
const { table } = require("table");
const loadFiles = require("./loadFiles");
const { t } = require("i18next");

/**
 * A function to load command modules
 * @type {import("./functions").LoadCommands}
 * @example await loadCommands(client, "src/commands");
 */
module.exports = async (client, dir) => {
  if (typeof dir !== "string") {
    throw new TypeError(t("errors:type_errors.string").replace(/{param}/g, "dir"));
  }

  const debug = client.config.console.debug.event;
  const tableData = [["Index".cyan, "Events".cyan, "File".cyan, "Status".cyan]];
  /**
   * @type {import("table").TableUserConfig}
   */
  const tableConfig = {
    columnDefault: {
      alignment: "center",
      width: 30,
    },
    columns: [{ width: 5 }, {}, {}, { width: 6 }],
    border: {
      topBody: `─`.blue,
      topJoin: `┬`.blue,
      topLeft: `┌`.blue,
      topRight: `┐`.blue,

      bottomBody: `─`.blue,
      bottomJoin: `┴`.blue,
      bottomLeft: `└`.blue,
      bottomRight: `┘`.blue,

      bodyLeft: `│`.blue,
      bodyRight: `│`.blue,
      bodyJoin: `│`.blue,

      joinBody: `─`.blue,
      joinLeft: `├`.blue,
      joinRight: `┤`.blue,
      joinJoin: `┼`.blue,
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
  client.commands.clear();

  let i = 0;
  for (const file of files) {
    const fileName = file.replace(/\\/g, "/").split("/").pop();

    try {
      /** @type {import("../../types/commands").BaseCommandStructure} */
      const command = require(file);

      if (
        command?.isDisabled ||
        (command?.isPrefixDisabled && command?.isSlashDisabled)
      ) {
        continue;
      }

      if (client.config.categories[command.category]?.enabled === false) continue;

      if (command?.aliases?.length) {
        for (const alias of command.aliases) {
          if (client.aliases.has(alias)) {
            throw new Error(`alias ${colors.yellow(alias)} already exist`);
          } else {
            client.aliases.set(alias, command.data.name);
          }
        }
      }

      if (command?.isPrefixDisabled === false) {
        client.commands.set(command.data.name, command);
      }

      if (command?.isSlashDisabled === false) {
        client.slashCommands.set(command.data.name, command);
      }

      if (command?.data.type === (2 || 3)) {
        client.contexts.set(command.data.name, command);
      }

      if (command.data.toJSON()) {
        client.newCommands.push({
          data: command.data.toJSON(),
          global: command.isGlobal,
          disabled: command?.isDisabled || command?.isSlashDisabled,
        });
      }

      i++;
      tableData.push([
        `${colors.magenta(i)}`,
        command.data.name.blue,
        fileName.green,
        "» 🌱 «",
      ]);
    } catch (error) {
      i++;
      tableData.push([`${colors.magenta(i)}`, "unknown".blue, fileName.red, "» 🔴 «"]);
      errors.push({ file: file, error: error });
    }
  }

  if (debug) console.log(table(tableData, tableConfig));

  if (errors.length > 0) {
    console.log(
      colors.yellow(
        "[AntiCrash] | [Command_Loader_Error_Logs] | [Start] : ===============",
      ),
    );
    errors.forEach((e) => {
      console.log(colors.yellow(e.file), "\n", colors.red(e.error), "\n");
    });
    console.log(
      colors.yellow(
        "[AntiCrash] | [Command_Loader_Error_Logs] | [End] : ===============",
      ),
    );
  }

  return client.logger.info(`loaded ${colors.yellow(i)} command modules`);
};
