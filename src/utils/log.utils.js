const { DateTime } = require("luxon");

function log(content, type = "log") {
    const date = DateTime.now();
    const logString =
        `${date.toFormat("cccc")}`.green +
        " | ".magenta +
        `${date.toFormat("dd/LL/yyyy")}`.red +
        " | ".magenta +
        `${date.toFormat("h:mm:ss a")}`.blue +
        " | ".magenta;

    switch (type) {
        case "log":
            {
                console.log(logString + `${content}`.gray);
            }
            break;
        case "warn":
            {
                console.log(logString + `${content}`.yellow);
            }
            break;
        case "error":
            {
                console.log(
                    logString +
                        `${content.name}: ${content.message}`.red +
                        `\n${content.stack}`
                );
            }
            break;
        case "debug":
            {
                console.log(logString + `${content}`.green);
            }
            break;
        case "command":
            {
                console.log(logString + `${content}`.blue);
            }
            break;
        case "event":
            {
                console.log(logString + `${content}`.yellow);
            }
            break;
        case "ready":
            {
                console.log(logString + `${content}`.cyan);
            }
            break;
        default:
            throw new TypeError(
                "Logger type must be either log, warn, error, debug, command, event or ready.".black
            );
    }
}

async function logBox(string = "", options = {}) {
    const boxen = await import("boxen");
    console.clear();
    if (!typeof string === "string" || !typeof options === "object") return;
    console.log(boxen.default(string, options));
}

async function mainLogBox(pkg) {
    await logBox(
        [
            `Welcome to ${pkg.name} git project.`.blue,
            `Thanks for running the repository.`.green,
            `Running on Node.Js ${process.version}.`.red,
            `${pkg.name.toUpperCase()}'s current version ${pkg.version}`
                .magenta,
            `Coded by ${pkg.author.name} with utmost dedication.`.cyan,
        ].join("\n"),
        {
            borderColor: "yellowBright",
            textAlignment: "center",
            padding: {
                left: 10,
                right: 10,
                top: 2,
                bottom: 2,
            },
            //backgroundColor: "black",
        }
    );
}

module.exports = { log, logBox, mainLogBox };
