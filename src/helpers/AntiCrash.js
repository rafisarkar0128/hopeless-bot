const colors = require('colors')
const { Logger } = require('../structures/Logger.js')
const logger = new Logger()

module.exports = () => {
    //process.on("beforeExit", async (code) => {
    //  console.log(
    //    colors.yellow(
    //      "[AntiCrash] | [BeforeExit_Logs] | [Start] : ==============="
    //    )
    //  );
    //  logger.log(code);
    //  console.log(
    //    colors.yellow("[AntiCrash] | [BeforeExit_Logs] | [End] : ===============")
    //  );
    //});

    //process.on("exit", async (error) => {
    //  console.log(
    //    colors.yellow("[AntiCrash] | [Exit_Logs] | [Start]  : ===============")
    //  );
    //  logger.error(error);
    //  console.log(
    //    colors.yellow("[AntiCrash] | [Exit_Logs] | [End] : ===============")
    //  );
    //});

    process.on('unhandledRejection', async (reason, promise) => {
        console.log(
            colors.yellow(
                '[AntiCrash] | [UnhandledRejection_Logs] | [start] : ==============='
            )
        )
        await logger.error(reason)
        console.log(
            colors.yellow(
                '[AntiCrash] | [UnhandledRejection_Logs] | [end] : ==============='
            )
        )
    })

    process.on('rejectionHandled', async (promise) => {
        console.log(
            colors.yellow(
                '[AntiCrash] | [RejectionHandled_Logs] | [Start] : ==============='
            )
        )
        await logger.error(promise)
        console.log(
            colors.yellow(
                '[AntiCrash] | [RejectionHandled_Logs] | [End] : ==============='
            )
        )
    })

    process.on('uncaughtException', async (error, origin) => {
        console.log(
            colors.yellow(
                '[AntiCrash] | [UncaughtException_Logs] | [Start] : ==============='
            )
        )
        await logger.error(error)
        console.log(
            colors.yellow(
                '[AntiCrash] | [UncaughtException_Logs] | [End] : ==============='
            )
        )
    })

    process.on('warning', (warning) => {
        console.log(
            colors.yellow(
                '[AntiCrash] | [Warning_Logs] | [Start] : ==============='
            )
        )
        logger.warn(warning)
        console.log(
            colors.yellow(
                '[AntiCrash] | [Warning_Logs] | [End] : ==============='
            )
        )
    })
}
