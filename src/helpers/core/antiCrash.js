const chalk = require("chalk");

/**
 * A function to handle crashes
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 */
function antiCrash(client) {
  if (!client || typeof client !== "object") {
    throw new Error("Client is not defined or not an object.");
  }

  if (client.config.bot.debug) {
    client.logger.debug("Setting up AntiCrash handlers.");
  }

  /**
   * A function to handle exit from terminal
   * @returns {Promise<void>}
   */
  async function handleExit() {
    if (client.config.bot.debug) {
      client.logger.debug("Exit signal received, initiating graceful shutdown.");
    }

    client.logger.info("disconnecting from discord.");
    await client.destroy();
    client.logger.success("disconnected successfully.");
    process.exit(0);
  }

  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);
  process.on("SIGQUIT", handleExit);

  if (client.config.bot.debug) {
    // Handle beforeExit event (Only for Debug)
    process.on("beforeExit", (code) => {
      console.log(chalk.yellow("[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="));
      client.logger.log(code);
      console.log(chalk.yellow("[AntiCrash] | [BeforeExit_Logs] | [End] : ==============="));
    });

    // Handle exit event (Only for Debug)
    process.on("exit", (code) => {
      console.log(chalk.yellow("[AntiCrash] | [Exit_Logs] | [Start] : ==============="));
      client.logger.log(code);
      console.log(chalk.yellow("[AntiCrash] | [Exit_Logs] | [End] : ==============="));
    });
  }

  // Handle unhandledRejection event
  process.on("unhandledRejection", (reason) => {
    if (client.config.bot.debug) {
      console.log(
        chalk.yellow("[AntiCrash] | [UnhandledRejection_Logs] | [Start] : ===============")
      );
      client.logger.error("Detailed unhandled rejection:\n", reason);
      console.log(
        chalk.yellow("[AntiCrash] | [UnhandledRejection_Logs] | [End]   : ===============")
      );
    } else {
      client.logger.error("Unhandled promise rejection occurred.");
    }
  });

  // Handle rejectionHandled event
  process.on("rejectionHandled", (promise) => {
    if (client.config.bot.debug) {
      console.log(
        chalk.yellow("[AntiCrash] | [RejectionHandled_Logs] | [Start] : ===============")
      );
      client.logger.error("Detailed rejection handled:\n", promise);
      console.log(
        chalk.yellow("[AntiCrash] | [RejectionHandled_Logs] | [End]   : ===============")
      );
    } else {
      client.logger.error("Handled promise rejection occurred.");
    }
  });

  // Handle uncaughtException event
  process.on("uncaughtException", (error) => {
    if (client.config.bot.debug) {
      console.log(
        chalk.yellow("[AntiCrash] | [UncaughtException_Logs] | [Start] : ===============")
      );
      client.logger.error("Detailed uncaught exception:\n", error);
      console.log(
        chalk.yellow("[AntiCrash] | [UncaughtException_Logs] | [End]   : ===============")
      );
    } else {
      client.logger.error("Uncaught exception occurred.");
    }
  });

  // Handle warning event
  process.on("warning", (warning) => {
    if (client.config.bot.debug) {
      console.log(chalk.yellow("[AntiCrash] | [Warning_Logs] | [Start] : ==============="));
      client.logger.warn("Detailed warning:\n", warning);
      console.log(chalk.yellow("[AntiCrash] | [Warning_Logs] | [End]   : ==============="));
    } else {
      client.logger.warn("Warning occurred.");
    }
  });

  client.logger.info("AntiCrash system has been loaded.");
}

module.exports = { antiCrash };
