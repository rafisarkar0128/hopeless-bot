const colors = require("colors");
const { table } = require("table");
const { t } = require("i18next");

/**
 * A function to log get vanity
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @returns {void}
 */
module.exports = async (client) => {
  // ansi colors with escape
  let esc = "\u001b[0m";
  let red = "\u001b[38;5;196m";
  let blue = "\u001b[38;5;45m";
  let green = "\u001b[38;5;49m";
  let yellow = "\u001b[38;5;11m";

  let vanity = [
    `y     __`,
    `y  ."\`  \`".`,
    `y /   /\\   \\`,
    `y|    \\/    | b_                      _               _           _  g______`,
    `y \\   ()   / b| |__   ___  _ __   ___| | ___  ___ ___| |__   ___ | |_g\\ \\ \\ \\ `,
    `y  '.____.'  b| '_ \\ / _ \\| '_ \\ / _ \\ |/ _ \\/ __/ __| '_ \\ / _ \\| __|g\\ \\ \\ \\ `,
    `y   {_.="}   b| | | | (_) | |_) |  __/ |  __/\\__ \\__ \\ |_) | (_) | |_  g) ) ) )`,
    `y   {_.="}   b|_| |_|\\___/| .__/ \\___|_|\\___||___/___/_.__/ \\___/ \\__|g/ / / /`,
    `y   \`-..-\`   r============b|_|r========================================g/_/_/_/`,
  ].join("\n");

  vanity = vanity
    .replace(/r/g, red)
    .replace(/g/g, green)
    .replace(/b/g, blue)
    .replace(/y/g, yellow)
    .replace(/e/g, esc);

  /**
   * @type {import("table").TableUserConfig}
   */
  const config = {
    columnDefault: {
      alignment: "center",
      width: 72,
    },
    border: {
      topBody: `─`.cyan,
      topJoin: `┬`.cyan,
      topLeft: `┌`.cyan,
      topRight: `┐`.cyan,

      bottomBody: `─`.cyan,
      bottomJoin: `┴`.cyan,
      bottomLeft: `└`.cyan,
      bottomRight: `┘`.cyan,

      bodyLeft: `│`.cyan,
      bodyRight: `│`.cyan,
      bodyJoin: `│`.cyan,

      joinBody: `─`.cyan,
      joinLeft: `├`.cyan,
      joinRight: `┤`.cyan,
      joinJoin: `┼`.cyan,
    },
    drawHorizontalLine: (lineIndex, rowCount) => {
      return lineIndex === 0 || lineIndex === rowCount;
    },
  };
  const data = [
    [""],
    [t("console:vanity.welcome", { name: colors.blue(client.pkg.name) })],
    [
      t("console:vanity.node", {
        v: colors.green(process.version),
      }),
    ],
    [
      t("console:vanity.version", {
        v: colors.yellow(client.pkg.version),
      }),
    ],
    [
      t("console:vanity.message", {
        author: colors.cyan(client.pkg.author.name),
      }),
    ],
    [""],
  ];

  console.log(vanity);
  console.log(table(data, config));
};
