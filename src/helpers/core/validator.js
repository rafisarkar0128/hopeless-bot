const chalk = require("chalk");

/**
 * A function to validate the whole configuration.
 * @param {import("@src/lib").DiscordClient} client
 * @returns {void}
 */
function validateConfig(client) {
  if (!client || typeof client !== "object") {
    throw new Error("Client is not defined or not an object.");
  }

  const errors = [];
  const warnings = [];
  const { Music } = client.resources;
  const { defaultLocale, availableLocales, bot, mongodbUri, dashboard, music } = client.config;
  const env = chalk.cyanBright(".env");

  // Checking if default locale was provided or not
  if (!defaultLocale) {
    warnings.push(
      `${chalk.yellow("DEFAULT_LOCALE")} in ${env} is empty. Using ${chalk.green("en-US")} as fallback locale.`
    );
  }

  // Checking the provided locale is valid or not
  if (!client.utils.getAvailableLocales().includes(defaultLocale)) {
    client.config.defaultLocale = "en-US";
    warnings.push(
      `${chalk.yellow("DEFAULT_LOCALE")} in ${env} is invalid. Using ${chalk.green("en-US")} as fallback locale.`
    );
  }

  // Checking if bot token was provided or not
  if (!bot.token) {
    errors.push(
      `${chalk.yellow("DISCORD_CLIENT_TOKEN")} in ${env} cannot be empty. Provide a valid token`
    );
  }

  // Checking if bot id was provided or not
  if (!bot.id) {
    errors.push(
      `${chalk.yellow("DISCORD_CLIENT_ID")} in ${env} cannot be empty. Provide a valid token`
    );
  }

  // Checking if guildId was provided or not
  if (!bot.guildId) {
    errors.push(`${chalk.yellow("GUILD_ID")} in ${env} cannot be empty. Provide a valid guild id`);
  }

  // Checking if bot ownerId was provided or not
  if (!bot.ownerId) {
    errors.push(`${chalk.yellow("OWNER_ID")} in ${env} cannot be empty. Provide a valid owner id`);
  }

  // Checking if developer's id was provided or not
  if (!bot.devs || bot.devs.length === 0) {
    warnings.push(
      `${chalk.yellow("DEV_IDS")} in ${env} is empty. Developer commands won't be accessible`
    );
  }

  // Checking if mongo uri was provided or not
  if (!mongodbUri) {
    errors.push(
      `${chalk.yellow("MONGO_URI")} in ${env} cannot be empty. Provide a valid mongo uri`
    );
  }

  // If dashboard is enabled check its config
  // if (dashboard.enabled) {
  //   // Check if bot secret was provided or not
  //   if (!process.env.DISCORD_CLIENT_SECRET) {
  //     errors.push(
  //       `${chalk.yellow(
  //         "DISCORD_CLIENT_SECRET"
  //       )} in ${env} cannot be empty. Provide a valid secret`
  //     );
  //   }
  //
  //   // Check if dashboard port was provided or not
  //   if (!process.env.DASHBOARD_PORT) {
  //     warnings.push(
  //       `${chalk.yellow(
  //         "DASHBOARD_PORT"
  //       )} in ${env} is empty. Using ${chalk.magenta(
  //         dashboard.port
  //       )} as fallback port`
  //     );
  //   }
  //
  //   // Checking if baseUrl was provived or not
  //   if (!dashboard.baseUrl) {
  //     errors.push(
  //       `${chalk.yellow("baseUrl")} cannot be empty. Provide a valid url`
  //     );
  //   }
  //
  //   // Checking if failureUrl was provived or not
  //   if (!dashboard.failureUrl) {
  //     errors.push(
  //       `${chalk.yellow("failureUrl")} cannot be empty. Provide a valid url`
  //     );
  //   }
  // }

  // If music enabled checking its config
  if (music.enabled) {
    // Checking if spotify credentials were provided or not
    // if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    // 	warnings.push(
    // 		`ENV: ${chalk.yellow("SPOTIFY_CLIENT_ID")} or ${chalk.yellow(
    // 			"SPOTIFY_CLIENT_SECRET",
    // 		)} were missing. Spotify music links won't work`,
    // 	);
    // }

    // Checking if lavalink nodes were provided in array or not
    if (!Array.isArray(music.nodes)) {
      errors.push(`${chalk.yellow("lavalinkNodes")} must be an Array of Lavalink Nodes`);
    }

    // Checking if lavalink nodes were provided or not
    if (music.nodes.length === 0) {
      errors.push(`${chalk.yellow("lavalinkNodes")} must have at least 1 Node to work`);
    }

    // Checking if the provided source is valid or not
    if (!Music.searchPlatforms.includes(music.defaultSearchPlatform)) {
      errors.push(
        `${chalk.yellow("defaultSearchPlatform")} is invalid. Provide a valid search platform`
      );
    }
  }

  // Checking if support server was provided or not
  if (!process.env.SUPPORT_SERVER) {
    warnings.push(
      `${chalk.yellow("SUPPORT_SERVER")} in ${env} is empty. Can not redirect users to support server.`
    );
  }

  // Logging warnings if any
  if (warnings.length > 0) {
    client.logger.warn(`Received ${warnings.length} warning(s)`);
    warnings.forEach((w) => client.logger.warn(w));
  }

  // Logging errors if any and exiting process
  if (errors.length > 0) {
    errors.forEach((e) => client.logger.error(e));
    process.exit(1);
  }
}

// /**
//  * @param {import('@structures/BaseContext')} context
//  */
// static validateContext(context) {
//   if (typeof context !== "object") {
//     throw new TypeError("Context must be an object");
//   }
//   if (
//     typeof context.name !== "string" ||
//     context.name !== context.name.toLowerCase()
//   ) {
//     throw new Error("Context name must be a lowercase string.");
//   }
//   if (typeof context.description !== "string") {
//     throw new TypeError("Context description must be a string.");
//   }
//   if (
//     context.type !== ApplicationCommandType.User &&
//     context.type !== ApplicationCommandType.Message
//   ) {
//     throw new TypeError("Context type must be a either User/Message.");
//   }
//   if (
//     Object.prototype.hasOwnProperty.call(context, "enabled") &&
//     typeof context.enabled !== "boolean"
//   ) {
//     throw new TypeError("Context enabled must be a boolean value");
//   }
//   if (
//     Object.prototype.hasOwnProperty.call(context, "ephemeral") &&
//     typeof context.ephemeral !== "boolean"
//   ) {
//     throw new TypeError("Context enabled must be a boolean value");
//   }
//   if (
//     Object.prototype.hasOwnProperty.call(context, "defaultPermission") &&
//     typeof context.defaultPermission !== "boolean"
//   ) {
//     throw new TypeError("Context defaultPermission must be a boolean value");
//   }
//   if (
//     Object.prototype.hasOwnProperty.call(context, "cooldown") &&
//     typeof context.cooldown !== "number"
//   ) {
//     throw new TypeError("Context cooldown must be a number");
//   }
//   if (context.userPermissions) {
//     if (!Array.isArray(context.userPermissions)) {
//       throw new TypeError(
//         "Context userPermissions must be an Array of permission key strings."
//       );
//     }
//     for (const perm of context.userPermissions) {
//       if (!permissions[perm])
//         throw new RangeError(`Invalid command userPermission: ${perm}`);
//     }
//   }
// }

module.exports = { validateConfig };
