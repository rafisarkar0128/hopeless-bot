const colors = require("colors");

module.exports = {
  AntiCrash: (client) => {
    process.on("beforeExit", async (code) => {
      console.log(
        colors.yellow(
          "[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="
        )
      );
      console.log(code);
      console.log(
        colors.yellow(
          "[AntiCrash] | [BeforeExit_Logs] | [End] : ==============="
        )
      );
    });

    process.on("exit", async (error) => {
      console.log(
        colors.yellow("[AntiCrash] | [Exit_Logs] | [Start]  : ===============")
      );
      console.log(error);
      console.log(
        colors.yellow("[AntiCrash] | [Exit_Logs] | [End] : ===============")
      );
    });

    process.on("unhandledRejection", async (reason, promise) => {
      console.log(
        colors.yellow(
          "[AntiCrash] | [UnhandledRejection_Logs] | [start] : ==============="
        )
      );
      await client.error(reason);
      console.log(
        colors.yellow(
          "[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============="
        )
      );
    });

    process.on("rejectionHandled", async (promise) => {
      console.log(
        colors.yellow(
          "[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="
        )
      );
      await client.error(promise);
      console.log(
        colors.yellow(
          "[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============="
        )
      );
    });

    process.on("uncaughtException", async (error, origin) => {
      console.log(
        colors.yellow(
          "[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="
        )
      );
      await client.error(error);
      console.log(
        colors.yellow(
          "[AntiCrash] | [UncaughtException_Logs] | [End] : ==============="
        )
      );
    });

    process.on("warning", async (warning) => {
      console.log(
        colors.yellow(
          "[AntiCrash] | [Warning_Logs] | [Start] : ==============="
        )
      );
      await client.warn(warning);
      console.log(
        colors.yellow("[AntiCrash] | [Warning_Logs] | [End] : ===============")
      );
    });
  },
};
