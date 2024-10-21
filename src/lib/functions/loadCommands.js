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
  if (typeof client !== "object") {
    throw new TypeError(t("errors:missing_parameter", { param: colors.bold("client") }));
  }
  if (typeof dir !== "string") {
    throw new TypeError(t("errors:type_errors.string"), { param: colors.bold("dir") });
  }
  client.logger.info(t("console:loaders.command.start", { dir: colors.green(dir) }));

  const debug = client.config.console.debug.event_table;
  const tableData = [["Index".cyan, "Events".cyan, "File".cyan, "Status".cyan]];
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

  let i = 0,
    l = 0;
  for (const file of files) {
    const fileName = file.replace(/\\/g, "/").split("/").pop();

    /** @type {import("@structures/command.d.ts").BaseCommandStructure} */
    const command = require(file);
    const { options, prefix, slash, context } = command;
    const {
      category,
      cooldown,
      premium,
      guildOnly,
      devOnly,
      voiceChannelOnly,
      botPermissions,
      userPermissions,
    } = options;

    try {
      commandName =
        command.prefix?.name ||
        command.slash?.data?.name ||
        command.context?.data?.name ||
        "undefined";

      if (options.category) {
        if (client.config.categories[category]?.enabled === false) continue;
      }

      if (prefix) {
        if (prefix?.disabled) continue;

        if (!prefix.name) throw new Error(t("errors:validations.command.prefix.name"));

        if (!prefix?.description || prefix.description?.length <= 0) {
          prefix.description = slash?.data.description;
        }

        if (prefix.aliases?.length) {
          for (const alias of prefix.aliases) {
            if (client.aliases.has(alias)) {
              throw new Error(`alias ${colors.yellow(alias)} already exist`);
            } else {
              client.aliases.set(alias, prefix.name);
            }
          }
        }

        client.commands.set(prefix.name, {
          category: category,
          cooldown: cooldown,
          premium: premium,
          guildOnly: guildOnly,
          devOnly: devOnly,
          voiceChannelOnly: voiceChannelOnly,
          botPermissions: botPermissions,
          userPermissions: userPermissions,
          name: prefix.name,
          description: prefix.description,
          aliases: prefix?.aliases,
          usage: prefix?.usage,
          disabled: prefix?.disabled,
          minArgsCount: prefix?.minArgsCount,
          subcommands: prefix?.subcommands,
          execute: prefix.execute,
        });
      }

      if (slash) {
        if (slash.disabled) continue;

        if (!slash.data) throw new Error("Missing command data");

        if (!slash.execute) throw new Error("Missing execute function");

        client.slashCommands.set(slash.data.name, {
          category: category,
          cooldown: cooldown,
          premium: premium,
          guildOnly: guildOnly,
          devOnly: devOnly,
          voiceChannelOnly: voiceChannelOnly,
          botPermissions: botPermissions,
          userPermissions: userPermissions,
          data: slash.data,
          ephemeral: slash.ephemeral,
          usage: slash.usage,
          global: slash.global,
          disabled: slash.disabled,
          execute: slash.execute,
        });

        client.Commands.push({
          data: slash.data.toJSON(),
          global: slash.global,
          disabled: slash.disabled,
        });
      }

      //
      //if (
      //  command?.isDisabled ||
      //  (command?.isPrefixDisabled && command?.isSlashDisabled)
      //) {
      //  continue;
      //}
      //if (client.config.categories[command.options.category]?.enabled === false) continue;
      //
      //if (command?.aliases?.length) {
      //}
      //
      //if (command?.isPrefixDisabled === false) {
      //  client.commands.set(command.data.name, command);
      //}
      //
      //if (command?.isSlashDisabled === false) {
      //  client.slashCommands.set(command.data.name, command);
      //}
      //
      //if (command?.data.type === (2 || 3)) {
      //  client.contexts.set(command.data.name, command);
      //}
      //
      //if (command.data.toJSON()) {
      //  client.Commands.push({
      //    data: command.data.toJSON(),
      //    global: command.isGlobal,
      //    disabled: command?.isDisabled || command?.isSlashDisabled,
      //  });
      //}

      i++ && l++;
      tableData.push([
        `${colors.magenta(i)}`,
        commandName.blue,
        fileName.green,
        "» 🌱 «",
      ]);
    } catch (error) {
      i++;
      tableData.push([`${colors.magenta(i)}`, commandName.blue, fileName.red, "» 🔴 «"]);
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

  return client.logger.info(`loaded ${colors.yellow(l)} command modules`);
};
