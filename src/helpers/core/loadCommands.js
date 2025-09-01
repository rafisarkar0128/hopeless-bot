const chalk = require("chalk");
const { table } = require("table");
const { loadFiles } = require("@utils/index.js");
const { Collection } = require("discord.js");
const path = require("path");

/**
 * A function to load command modules
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 */
async function loadCommands(client) {
  if (typeof client !== "object") {
    throw new TypeError(`Parameter (${chalk.yellow("client")}) must be an object.`);
  }

  const { Categories, Permissions } = client.resources;
  const files = await loadFiles("src/commands", [".js"]);
  let i = 0;
  let disabledCount = 0;
  let errorCount = 0;

  // Clear existing command data from collections
  client.commands.clear();
  client.aliases.clear();
  client.cooldowns.clear();

  // Pre-calculate the maximum filename length for consistent formatting
  const maxFileNameLength = Math.max(...files.map((f) => path.basename(f).length), 12);
  // Pre-calculate the maximum category name length for consistent formatting
  const maxCategoryNameLength = Math.max(
    ...Object.getOwnPropertyNames(Categories).map((c) => c.length),
    8
  );

  // Enhanced table headers with colors
  const tableData = [
    [
      chalk.bold.cyan("Command Name"),
      chalk.bold.cyan("Category"),
      chalk.bold.cyan("Prefix"),
      chalk.bold.cyan("Slash"),
      chalk.bold.cyan("Status"),
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
    border: client.utils.getTableBorder("blue"),
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
      { alignment: "left", width: maxFileNameLength }, // Command Name
      { width: maxCategoryNameLength }, // Category
      { width: 8 }, // Prefix
      { width: 8 }, // Slash
      { width: 10 }, // Status
    ],
    header: {
      alignment: "center",
      content: chalk.bold.yellow(
        "COMMAND FILES\nHere is the list of all command files loaded into the bot."
      ),
    },
    spanningCells: [{ col: 0, row: files.length + 1, colSpan: 5, alignment: "center" }],
  };

  for (const file of files) {
    const fileName = path.basename(file);
    try {
      const Command = require(file);
      /**
       * Base Command as a type for auto completion
       * @type {import("@structures/index").BaseCommand}
       */
      const cmd = new Command();
      const { data, options, prefixOptions, slashOptions } = cmd;

      // Check if the command is disabled & skipping it
      if (typeof options.disabled === "boolean" && options.disabled) {
        disabledCount++;
        if (client.config.showTable.command) {
          tableData.push([
            chalk.gray(cmd.data.name || fileName),
            chalk.gray(cmd.options.category.toUpperCase() || "N/A"),
            chalk.red("✗"),
            chalk.red("✗"),
            chalk.gray(" DISABLED "),
          ]);
        }
        continue;
      }

      // checking if category is valid and wheither whole category is disabled
      if (Categories[options.category]?.enabled === false) continue;
      if (options.category && !Object.keys(Categories).includes(options.category)) {
        throw new Error(`"${options.category}" is not a valid command category.`);
      }

      // validating and setting cooldown
      if (options.cooldown && typeof options.cooldown !== "number") {
        throw new TypeError(`Command coodown must be a number.`);
      }
      if (options.cooldown > 0) {
        client.cooldowns.set(data.name, new Collection());
      }

      // checking if bot permissions are valid
      if (!Array.isArray(options.permissions.bot)) {
        throw new TypeError(`Command permissions for bot must be an array of strings.`);
      }
      for (const p of options.permissions.bot) {
        if (!Permissions.includes(p)) {
          throw new RangeError(`"${p}" is not a valid bot permission.`);
        }
      }

      // checking if user permissions are valid
      if (!Array.isArray(options.permissions.user)) {
        throw new TypeError(`Command permissions for user must be an array of strings.`);
      }
      for (const p of options.permissions.user) {
        if (!Permissions.includes(p)) {
          throw new RangeError(`"${p}" is not a valid user permission.`);
        }
      }

      // checking if aliases are correct
      if (!Array.isArray(prefixOptions.aliases)) {
        throw new TypeError(`Command aliases must be an array of strings.`);
      }
      for (const alias of prefixOptions.aliases) {
        if (typeof alias !== "string") {
          throw new TypeError(`Command alias must be a string.`);
        }
        let aliasExist = client.aliases.get(alias);
        if (aliasExist) {
          throw new Error(`Command alias "${alias}" is already in use for "${aliasExist}".`);
        }
        client.aliases.set(alias, data.name);
      }

      // checking for valid minArgsCount
      if (typeof prefixOptions.minArgsCount !== "number" || prefixOptions.minArgsCount < 0) {
        throw new TypeError(`Command minArgsCount must be a non-negative number.`);
      }

      // checking if prefix command execute function is valid
      if (
        options.disabled?.prefix &&
        (!cmd.executePrefix || typeof cmd.executePrefix !== "function")
      ) {
        throw new Error(`Execute function for prefix command is missing.`);
      }

      // checking if slash command execute function is valid
      if (
        options.disabled?.slash &&
        (!cmd.executeSlash || typeof cmd.executeSlash !== "function")
      ) {
        throw new Error(`Execute function for slash command is missing.`);
      }

      // checking if global option is valid
      if (!client.config.bot.global && cmd.options.global) {
        // if not setting default option provided in config
        cmd.options.global = client.config.bot.global;
      }

      i++;
      client.commands.set(cmd.data.name, cmd);
      client.applicationCommands.push(cmd.data?.toJSON());
      if (client.config.showTable.command) {
        tableData.push([
          cmd.data.name,
          cmd.options.category.toUpperCase(),
          cmd.options.disabled.prefix ? chalk.red("✗") : chalk.green("✓"),
          cmd.options.disabled.slash ? chalk.red("✗") : chalk.green("✓"),
          chalk.green(" LOADED "),
        ]);
      }
    } catch (error) {
      errorCount++;
      client.logger.error(`Error loading command ${fileName}:`, error);
      if (client.config.showTable.command) {
        tableData.push([
          chalk.red(fileName),
          chalk.gray("N/A"),
          chalk.gray("N/A"),
          chalk.gray("N/A"),
          chalk.bold.red(" ERROR "),
        ]);
      }
    }
  }

  if (client.config.showTable.command) {
    // Add summary row - all values must be strings, not objects
    const summary = `${chalk.bold("SUMMARY")}: Total: ${chalk.white(files.length)}, Loaded: ${chalk.green(i)}, Errors: ${chalk.red(errorCount)}, Disabled: ${chalk.gray(disabledCount)}`;

    tableData.push([summary, "", "", "", ""]);
    console.log(table(tableData, tableConfig));
  }

  // Enhanced final log message with colors
  const statusMessage = errorCount > 0 ? chalk.red("with errors") : chalk.green("successfully");

  client.logger.info(
    `Loaded ${chalk.yellow(i)} commands ${statusMessage}. ` +
      `(${chalk.gray(disabledCount)} disabled, ${chalk.red(errorCount)} errors)`
  );
}

module.exports = { loadCommands };
