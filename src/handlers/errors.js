async function loadErrors(client) {
    const { sendErrors } = require("../utils/error.utils.js");
    const { log } = require("../utils/log.utils.js");

    process.on("beforeExit", (code) => {
        console.log(
            "[AntiCrash] | [BeforeExit_Logs] | [Start] : ===============".yellow
        );
        log(code, "error");
        sendErrors(client, code);
        console.log(
            "[AntiCrash] | [BeforeExit_Logs] | [End] : ===============".yellow
        );
    });

    process.on("exit", (error) => {
        console.log(
            "[AntiCrash] | [Exit_Logs] | [Start]  : ===============".yellow
        );
        log(error, "error");
        sendErrors(client, error);
        console.log(
            "[AntiCrash] | [Exit_Logs] | [End] : ===============".yellow
        );
    });

    process.on("unhandledRejection", async (reason, promise) => {
        console.log(
            "[AntiCrash] | [UnhandledRejection_Logs] | [start] : ==============="
                .yellow
        );
        log(reason, "error");
        sendErrors(client, reason);

        "[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============="
            .yellow;
    });

    process.on("rejectionHandled", (promise) => {
        console.log(
            "[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============="
                .yellow
        );
        log(promise, "error");
        sendErrors(client, promise);
        console.log(
            "[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============="
                .yellow
        );
    });

    process.on("uncaughtException", (error, origin) => {
        console.log(
            "[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============="
                .yellow
        );
        log(error, "error");
        sendErrors(client, error);
        console.log(
            "[AntiCrash] | [UncaughtException_Logs] | [End] : ==============="
                .yellow
        );
    });

    process.on("warning", (warning) => {
        console.log(
            "[AntiCrash] | [Warning_Logs] | [Start] : ===============".yellow
        );
        log(warning, "warn");
        sendErrors(client, warning);
        console.log(
            "[AntiCrash] | [Warning_Logs] | [End] : ===============".yellow
        );
    });
}

module.exports = { loadErrors };
