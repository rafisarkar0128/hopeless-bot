const chalk = require("chalk");
const { table } = require("table");
const { loadFiles } = require("@utils/index.js");
const { Collection } = require("discord.js");

/**
 * A function to load command modules
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 */
async function loadCommands(client) {
  if (typeof client !== "object") {
    throw new TypeError(`Parameter (${chalk.yellow("client")}) must be an object.`);
  }

  const tableData = [["Command", "Status"]];
  /**
   * Typings for table config.
   * @type {import("table").TableUserConfig}
   */
  const tableConfig = {
    columnDefault: {
      alignment: "center",
    },
    border: client.utils.getTableBorder("blue"),
    drawHorizontalLine: (lineIndex, rowCount) => {
      return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
    },
    columns: [{ alignment: "left" }, { width: 6 }],
  };

  const { Categories, Permissions } = client.resources;
  const { bot } = client.config;
  const commandFiles = await loadFiles("src/commands", [".js"]);

  client.commands.clear();
  client.aliases.clear();
  client.cooldowns.clear();

  let i = 0;

  for (const file of commandFiles) {
    const filePath = `${chalk.yellow("filePath")} => ${chalk.yellow(file)}`;
    try {
      const Command = require(file);
      /**
       * Base Command as a type for auto completion
       * @type {import("@structures/index").BaseCommand}
       */
      const cmd = new Command();
      const { data, options, prefixOptions, slashOptions } = cmd;

      // Check if the command is disabled
      if (typeof options.disabled === "boolean" && options.disabled) continue;

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
      if (!bot.global && cmd.global) cmd.global = bot.global;

      i++;
      client.commands.set(cmd.data.name, cmd);
      client.applicationCommands.push(cmd.data?.toJSON());
      tableData.push([chalk.blue(cmd.name), "» 🌱 «"]);
    } catch (error) {
      client.logger.error(error);
      console.log(filePath);
      tableData.push([chalk.red(file.split(/[\\|/]/g).pop()), "» 🔴 «"]);
    }
  }

  if (client.config.showTable.command) {
    console.log(table(tableData, tableConfig));
  }
  client.logger.info(`Loaded ${chalk.yellow(i)} commands successfully.`);
}

module.exports = { loadCommands };
