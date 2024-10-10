const colors = require("colors");

/** @param {import("@lib/DiscordBot").DiscordBot} client */
function AntiCrash(client) {
  process.on("beforeExit", async (code) => {
    console.log(
      colors.yellow("[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="),
    );
    client.logger.error(code);
    console.log(
      colors.yellow("[AntiCrash] | [BeforeExit_Logs] | [End] : ==============="),
    );
  });

  process.on("exit", async (code) => {
    console.log(colors.yellow("[AntiCrash] | [Exit_Logs] | [Start] : ==============="));
    client.logger.error(code);
    console.log(colors.yellow("[AntiCrash] | [Exit_Logs] | [End] : ==============="));
  });

  process.on("unhandledRejection", async (reason, promise) => {
    console.log(
      colors.yellow(
        "[AntiCrash] | [UnhandledRejection_Logs] | [start] : ===============",
      ),
    );
    await client.logger.error(reason, "unhandledRejection");
    console.log(
      colors.yellow("[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============="),
    );
  });

  process.on("rejectionHandled", async (promise) => {
    console.log(
      colors.yellow("[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="),
    );
    await client.logger.error(promise, "rejectionHandled");
    console.log(
      colors.yellow("[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============="),
    );
  });

  process.on("uncaughtException", async (error, origin) => {
    console.log(
      colors.yellow("[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="),
    );
    await client.logger.error(error, "uncaughtException");
    console.log(
      colors.yellow("[AntiCrash] | [UncaughtException_Logs] | [End] : ==============="),
    );
  });

  process.on("warning", async (warning) => {
    console.log(
      colors.yellow("[AntiCrash] | [Warning_Logs] | [Start] : ==============="),
    );
    client.logger.warn(warning);
    console.log(colors.yellow("[AntiCrash] | [Warning_Logs] | [End] : ==============="));
  });
}

module.exports = { AntiCrash };
