const colors = require("colors");
const { table } = require("table");
const { loadFiles } = require("./loadFiles");
const { Permissions } = require("./validations/permissions.js");
const { t } = require("i18next");

/**
 * A function to load command modules
 * @type {import("./helpers").LoadCommands}
 * @example await loadCommands(client, "src/commands");
 */
async function loadCommands(client, dir) {
  if (typeof client !== "object") {
    throw new TypeError(
      t("errors:missing_parameter", { param: colors.yellow("client") }),
    );
  }
  if (typeof dir !== "string") {
    throw new TypeError(t("errors:type.string"), { param: colors.yellow("dir") });
  }

  client.logger.info(
    __filename,
    t("default:loader.command.start", { dir: colors.green(dir) }),
  );

  const tableData = [
    [
      colors.cyan("Index"),
      colors.cyan("Command"),
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
    border: client.utils.getTableBorder("blue"),
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
    const filename = file.split(/[\\/]/g).pop();
    var cname = filename.slice(0, -3);

    /** @type {import("@structures/command.d.ts").BaseCommandStructure} */
    const command = require(file);

    const { options, prefix, slash, context } = command;
    const category = options?.category || "none";
    const cooldown = options?.cooldown || 0;
    const premium = options?.premium || false;
    const guildOnly = options?.guildOnly || false;
    const devOnly = options?.devOnly || false;
    const voiceChannelOnly = options?.voiceChannelOnly || false;
    const botPermissions = options?.botPermissions || [];
    const userPermissions = options?.userPermissions || [];

    try {
      if (category !== "none") {
        if (client.config.categories[category]?.enabled === false) continue;
      }

      if (botPermissions.length > 0) {
        for (let p of botPermissions) {
          if (!Permissions.includes(p)) {
            throw new Error(
              t("errors:validations.command.permission", { p: colors.yellow(p) }),
            );
          }
        }
      }

      if (userPermissions.length > 0) {
        for (let p of userPermissions) {
          if (!Permissions.includes(p)) {
            throw new Error(
              t("errors:validations.command.permission", { p: colors.yellow(p) }),
            );
          }
        }
      }

      if (prefix) {
        if (!prefix.name) {
          throw new Error(
            t("errors:validations.command.name", { type: colors.yellow("Prefix") }),
          );
        }

        cname = prefix.name;

        if (!prefix.description || prefix.description?.length <= 0) {
          prefix.description = slash?.data.description;
        }

        if (prefix.aliases?.length) {
          for (const alias of prefix.aliases) {
            let cmd = client.aliases.get(alias);
            if (!client.aliases.has(alias)) {
              client.aliases.set(alias, prefix.name);
            } else {
              throw new Error(
                t("errors:validations.command.alias", {
                  alias: colors.yellow(alias),
                  cmd: colors.yellow(cmd),
                }),
              );
            }
          }
        }

        if (!prefix.execute) {
          throw new Error(
            t("errors:validations.command.function", { type: colors.yellow("Prefix") }),
          );
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
          aliases: prefix.aliases || [],
          usage: prefix.usage || "",
          disabled: prefix.disabled || false,
          minArgsCount: prefix?.minArgsCount || 0,
          subcommands: prefix?.subcommands || [],
          execute: prefix.execute,
        });
      }

      if (slash) {
        if (!slash.data) {
          throw new Error(
            t("errors:validations.command.data", { type: colors.yellow("Slash") }),
          );
        }
        cname = slash.data.name;

        if (!slash.execute) {
          throw new Error(
            t("errors:validations.command.function", { type: colors.yellow("Slash") }),
          );
        }

        client.slashCommands.set(slash.data.name, {
          category: category,
          cooldown: cooldown,
          premium: premium,
          guildOnly: guildOnly,
          devOnly: devOnly,
          voiceChannelOnly: voiceChannelOnly,
          botPermissions: botPermissions,
          userPermissions: userPermissions,
          data: slash.data.toJSON(),
          ephemeral: slash.ephemeral,
          usage: slash.usage,
          global: slash.global,
          disabled: slash.disabled,
          execute: slash.execute,
        });
      }

      if (context && !context?.disabled) {
        if (context.disabled) continue;

        if (!context.data) {
          throw new Error(
            t("errors:validations.command.data", { type: colors.yellow("ContextMenu") }),
          );
        }
        cname = context.data?.name;

        if (!context.execute) {
          throw new Error(
            t("errors:validations.command.function", {
              type: colors.yellow("ContextMenu"),
            }),
          );
        }

        client.contexts.set(context.data.name, {
          category: category,
          cooldown: cooldown,
          premium: premium,
          guildOnly: guildOnly,
          devOnly: devOnly,
          voiceChannelOnly: voiceChannelOnly,
          botPermissions: botPermissions,
          userPermissions: userPermissions,
          data: context.data.toJSON(),
          ephemeral: context.ephemeral,
          global: context.global,
          disabled: context.disabled,
          execute: context.execute,
        });
      }

      if ((prefix?.disabled && slash?.disabled) || context?.disabled) {
        continue;
      }

      i++;
      l++;
      tableData.push([
        `${colors.magenta(i)}`,
        colors.blue(cname),
        colors.green(filename),
        "» 🌱 «",
      ]);
    } catch (error) {
      i++;
      tableData.push([
        `${colors.magenta(i)}`,
        colors.red(cname),
        colors.red(filename),
        "» 🔴 «",
      ]);
      errors.push({ file: file, error: error });
    }
  }

  if (client.config.table.command) console.log(table(tableData, tableConfig));

  if (errors.length > 0) {
    console.log(colors.yellow(t("errors:loader.command.start")));
    errors.forEach((e) => {
      console.log(colors.green(e.file), "\n", colors.red(e.error), "\n");
    });
    console.log(colors.yellow(t("errors:loader.command.end")));
  }

  client.logger.info(
    __filename,
    t("default:loader.command.end", { l: colors.yellow(l) }),
  );
}

module.exports = { loadCommands };
