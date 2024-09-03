const colors = require("colors");
const { DateTime } = require("luxon");
const DateTimeString = colors.gray(
    DateTime.now().toFormat("[dd/LL/yyyy - HH:mm:ss]")
);

function log(content, type = "log") {
    switch (type) {
        case "log":
            {
                console.log(
                    DateTimeString +
                        "log    ".gray +
                        " | ".magenta +
                        `${content}`.gray
                );
            }
            break;
        case "warn":
            {
                console.log(
                    DateTimeString +
                        "warn   " +
                        " | ".magenta +
                        `${content}`.yellow
                );
            }
            break;
        case "error":
            {
                console.log(
                    DateTimeString +
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
                    DateTimeString +
                        "debug  ".green +
                        " | ".magenta +
                        `${content}`.green
                );
            }
            break;
        case "command":
            {
                console.log(
                    DateTimeString +
                        "command".blue +
                        " | ".magenta +
                        `${content}`.blue
                );
            }
            break;
        case "event":
            {
                console.log(
                    DateTimeString +
                        "event  ".yellow +
                        " | ".magenta +
                        `${content}`.yellow
                );
            }
            break;
        case "ready":
            {
                console.log(
                    DateTimeString +
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
            `Welcome to ${colors.blue(pkg.name.toUpperCase())} project`,
            `Hoseted by Node.Js ${colors.green(process.version)}`,
            `Running on ${colors.yellow("v" + pkg.version)}`,
            `Coded by ${colors.cyan.italic(pkg.author.name)}`,
        ].join("\n"),
        {
            borderColor: "#00BFFF",
            stringAlignment: "center",
            padding: {
                left: 10,
                right: 10,
                top: 2,
                bottom: 2,
            },
        }
    );
}

module.exports = { log, logBox, mainLogBox };
