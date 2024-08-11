async function loadErrors() {
    const log = require("../functions/log.js");
    const chalk = require("chalk");

    process.on("beforeExit", (code) => {
        console.log(
            chalk.yellow(
                "[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="
            )
        );
        log(code, "error");
        console.log(
            chalk.yellow(
                "[AntiCrash] | [BeforeExit_Logs] | [End] : ==============="
            )
        );
    });

    process.on("exit", (error) => {
        console.log(
            chalk.yellow(
                "[AntiCrash] | [Exit_Logs] | [Start]  : ==============="
            )
        );
        log(error, "error");
        console.log(
            chalk.yellow("[AntiCrash] | [Exit_Logs] | [End] : ===============")
        );
    });

    process.on("unhandledRejection", async (reason, promise) => {
        console.log(
            chalk.yellow(
                "[AntiCrash] | [UnhandledRejection_Logs] | [start] : ==============="
            )
        );
        log(reason, "error");
        console.log(
            chalk.yellow(
                "[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============="
            )
        );
    });

    process.on("rejectionHandled", (promise) => {
        console.log(
            chalk.yellow(
                "[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="
            )
        );
        log(promise, "error");
        console.log(
            chalk.yellow(
                "[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============="
            )
        );
    });

    process.on("uncaughtException", (error, origin) => {
        console.log(
            chalk.yellow(
                "[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="
            )
        );
        log(error, "error");
        console.log(
            chalk.yellow(
                "[AntiCrash] | [UncaughtException_Logs] | [End] : ==============="
            )
        );
    });

    process.on("warning", (warning) => {
        console.log(
            chalk.yellow(
                "[AntiCrash] | [Warning_Logs] | [Start] : ==============="
            )
        );
        log(warning, "warn");
        console.log(
            chalk.yellow(
                "[AntiCrash] | [Warning_Logs] | [End] : ==============="
            )
        );
    });
}

module.exports = { loadErrors };
