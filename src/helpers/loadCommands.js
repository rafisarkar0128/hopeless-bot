const chalk = require("chalk");
const { table } = require("table");
const { loadFiles } = require("./loadFiles");
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
  client.cooldowns.clear();
  let i = 0;

  for (const file of commandFiles) {
    const filePath = `${chalk.yellow("filePath")} => ${chalk.yellow(file)}`;
    try {
      const Command = require(file);
      /**
       * Base Command as a type for auto completion
       * @type {import("@root/src/structures/BaseCommand.js")}
       */
      const cmd = new Command();

      if (cmd.disabled) continue;
      if (Categories[cmd.category]?.enabled === false) continue;

      if (cmd.category && !Object.keys(Categories).includes(cmd.category)) {
        throw new Error(`"${cmd.category}" is not a valid command category.`);
      }

      if (cmd.cooldown && typeof cmd.cooldown !== "number") {
        throw new TypeError(`Command coodown must be a number.`);
      }

      if (cmd.cooldown > 0) {
        client.cooldowns.set(cmd.data.name, new Collection());
      }

      if (!Array.isArray(cmd.permissions.bot)) {
        throw new TypeError(`Command permissions for bot must be an array of strings.`);
      }

      for (const p of cmd.permissions.bot) {
        if (!Permissions.includes(p)) {
          throw new RangeError(`"${p}" is not a valid bot permission.`);
        }
      }

      if (!Array.isArray(cmd.permissions.user)) {
        throw new TypeError(`Command permissions for user must be an array of strings.`);
      }

      for (const p of cmd.permissions.user) {
        if (!Permissions.includes(p)) {
          throw new RangeError(`"${p}" is not a valid user permission.`);
        }
      }

      if (!cmd.execute || typeof cmd.execute !== "function") {
        throw new Error(`Execute function is missing.`);
      }

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
