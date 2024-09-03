const colors = require("colors");

module.exports = (client) => {
    process.on("beforeExit", (code) => {
        console.log(
            colors.yellow(
                "[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="
            )
        );
        client.error(code);
        console.log(
            colors.yellow(
                "[AntiCrash] | [BeforeExit_Logs] | [End] : ==============="
            )
        );
    });

    process.on("exit", (error) => {
        console.log(
            colors.yellow(
                "[AntiCrash] | [Exit_Logs] | [Start]  : ==============="
            )
        );
        client.error(error);
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
        client.error(reason);
        console.log(
            colors.yellow(
                "[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============="
            )
        );
    });

    process.on("rejectionHandled", (promise) => {
        console.log(
            colors.yellow(
                "[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="
            )
        );
        client.error(promise);
        console.log(
            colors.yellow(
                "[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============="
            )
        );
    });

    process.on("uncaughtException", (error, origin) => {
        console.log(
            colors.yellow(
                "[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="
            )
        );
        client.error(error);
        console.log(
            colors.yellow(
                "[AntiCrash] | [UncaughtException_Logs] | [End] : ==============="
            )
        );
    });

    process.on("warning", (warning) => {
        console.log(
            colors.yellow(
                "[AntiCrash] | [Warning_Logs] | [Start] : ==============="
            )
        );
        client.error(warning, "warn");
        console.log(
            colors.yellow(
                "[AntiCrash] | [Warning_Logs] | [End] : ==============="
            )
        );
    });
};
