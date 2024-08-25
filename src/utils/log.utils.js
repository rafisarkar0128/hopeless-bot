const { DateTime } = require("luxon");
const date = DateTime.now();

function log(content, type = "log") {
    const logString =
        `${date.toFormat("dd/LL/yyyy")}`.red +
        " | ".magenta +
        `${date.toFormat("HH:mm:ss")}`.blue +
        " | ".magenta;

    switch (type) {
        case "log":
            {
                console.log(
                    logString +
                        "log    ".gray +
                        " | ".magenta +
                        `${content}`.gray
                );
            }
            break;
        case "warn":
            {
                console.log(
                    logString + "warn   " + " | ".magenta + `${content}`.yellow
                );
            }
            break;
        case "error":
            {
                console.log(
                    logString +
                        "error  ".red +
                        " | ".magenta +
                        `${content.name}: ${content.message}`.red +
                        `\n${content.stack}`
                );
            }
            break;
        case "debug":
            {
                console.log(
                    logString +
                        "debug  ".green +
                        " | ".magenta +
                        `${content}`.green
                );
            }
            break;
        case "command":
            {
                console.log(
                    logString +
                        "command".blue +
                        " | ".magenta +
                        `${content}`.blue
                );
            }
            break;
        case "event":
            {
                console.log(
                    logString +
                        "event  ".yellow +
                        " | ".magenta +
                        `${content}`.yellow
                );
            }
            break;
        case "ready":
            {
                console.log(
                    logString +
                        "ready  ".cyan +
                        " | ".magenta +
                        `${content}`.cyan
                );
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
