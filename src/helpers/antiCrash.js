const chalk = require("chalk");

/**
 * A function to handle crashes
 * @param {import("@lib/DiscordClient").DiscordClient} client
 * @returns {Promise<void>}
 */
function antiCrash(client) {
  client.logger.info("AntiCrash system has been loaded.");

  /**
   * A function to handle exit from terminal
   * @returns {Promise<void>}
   */
  async function handleExit() {
    client.logger.start("disconnecting from discord.");
    await client.destroy();
    client.logger.success("disconnected successfully.");
    process.exit(0);
  }

  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);
  process.on("SIGQUIT", handleExit);

  // Handle beforeExit event (Only for Debug)
  // process.on("beforeExit", (code) => {
  //   console.log(
  //     chalk.yellow(
  //       "[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="
  //     )
  //   );
  //   client.logger.log(code);
  //   console.log(
  //     chalk.yellow("[AntiCrash] | [BeforeExit_Logs] | [End] : ===============")
  //   );
  // });

  // Handle exit event (Only for Debug)
  // process.on("exit", (code) => {
  //   console.log(
  //     chalk.yellow("[AntiCrash] | [Exit_Logs] | [Start] : ===============")
  //   );
  //   client.logger.log(code);
  //   console.log(
  //     chalk.yellow("[AntiCrash] | [Exit_Logs] | [End] : ===============")
  //   );
  // });

  // Handle unhandledRejection event
  process.on("unhandledRejection", (reason) => {
    console.log(
      chalk.yellow("[AntiCrash] | [UnhandledRejection_Logs] | [Start] : ===============")
    );
    client.logger.error(reason);
    console.log(
      chalk.yellow("[AntiCrash] | [UnhandledRejection_Logs] | [End]   : ===============")
    );
  });

  // Handle rejectionHandled event
  process.on("rejectionHandled", (promise) => {
    console.log(chalk.yellow("[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="));
    client.logger.error(promise);
    console.log(chalk.yellow("[AntiCrash] | [RejectionHandled_Logs] | [End]   : ==============="));
  });

  // Handle uncaughtException event
  process.on("uncaughtException", (error) => {
    console.log(chalk.yellow("[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="));
    client.logger.error(error);
    console.log(chalk.yellow("[AntiCrash] | [UncaughtException_Logs] | [End]   : ==============="));
  });

  // Handle warning event
  process.on("warning", (warning) => {
    console.log(chalk.yellow("[AntiCrash] | [Warning_Logs] | [Start] : ==============="));
    client.logger.warn(warning);
    console.log(chalk.yellow("[AntiCrash] | [Warning_Logs] | [End]   : ==============="));
  });
}

module.exports = { antiCrash };
