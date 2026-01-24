const chalk = require("chalk");
const { loadFiles } = require("@utils/index.js");
const { basename } = require("path");

/**
 * A function to load button modules
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 */
async function loadButtons(client) {
  if (client.config.debug) client.logger.debug(`Loading button modules....`);

  const { categories, permissions } = client.resources;
  const files = await loadFiles("src/buttons", [".js"]);
  let i = 0;
  let disabledCount = 0;
  let errorCount = 0;

  // Clear existing button data from collections
  client.buttons.clear();

  for (const file of files) {
    const fileName = basename(file, ".js");
    try {
      const Button = require(file);
      /**
       * Base Button as a type for auto completion
       * @type {import("@structures/index").BaseButton}
       */
      const btn = new Button();

      // Check if the button is disabled & skip it
      if (btn.options.disabled) {
        disabledCount++;
        continue;
      }

      // checking if category is valid and whether whole category is disabled
      if (categories[btn.options.category]?.enabled === false) continue;
      if (btn.options.category && !Object.keys(categories).includes(btn.options.category)) {
        throw new Error(`"${btn.options.category}" is not a valid button category.`);
      }

      // checking if bot permissions are valid
      if (!Array.isArray(btn.permissions.bot)) {
        throw new TypeError(`Button permissions for bot must be an array of strings.`);
      }
      for (const p of btn.permissions.bot) {
        if (!permissions.includes(p)) {
          throw new RangeError(`"${p}" is not a valid bot permission.`);
        }
      }

      // checking if user permissions are valid
      if (!Array.isArray(btn.permissions.user)) {
        throw new TypeError(`Button permissions for user must be an array of strings.`);
      }
      for (const p of btn.permissions.user) {
        if (!permissions.includes(p)) {
          throw new RangeError(`"${p}" is not a valid user permission.`);
        }
      }

      // checking if button execute function is valid
      if (!btn.execute || typeof btn.execute !== "function") {
        throw new Error(`Execute function for button is missing.`);
      }

      i++;
      client.buttons.set(btn.data.customId, btn);
    } catch (error) {
      errorCount++;

      // Always show a simple error message
      client.logger.error(`Failed to load button ${chalk.yellow(fileName)}`);

      // Show detailed error only in debug mode
      if (client.config.debug) {
        client.logger.error(`Detailed error for ${fileName}:\n`, error);
      }
    }
  }

  // Enhanced final log message with colors
  const statusMessage = errorCount > 0 ? chalk.red("with errors") : chalk.green("successfully");

  client.logger.info(
    `Loaded ${chalk.yellow(i)} buttons ${statusMessage}. ` +
      `(${chalk.gray(disabledCount)} disabled, ${chalk.red(errorCount)} errors)`
  );
}

module.exports = { loadButtons };
