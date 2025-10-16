const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const chalk = require("chalk");

/**
 * A function to load languages
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 * @example
 * await client.helpers.loadLocales(client);
 */
async function loadLocales(client) {
  if (client.config.debug) client.logger.debug(`Loading locales....`);

  // initializing i18next with i18next-fs-backend
  await i18next.use(Backend).init({
    initAsync: false,
    load: "currentOnly",
    ns: ["commands", "context", "embeds", "misc", "handlers", "player"],
    defaultNS: false,
    fallbackNS: false,
    fallbackLng: ["en-US"],
    lng: client.config.defaultLocale ?? "en-US",
    interpolation: { escapeValue: false },
    preload: readdirSync(join(process.cwd(), "src/locales")).filter((dir) => {
      const dirPath = join(process.cwd(), "src/locales", dir);
      return lstatSync(dirPath).isDirectory() && readdirSync(dirPath).length > 0;
    }),
    backend: {
      loadPath: join(process.cwd(), "src/locales", "{{lng}}/{{ns}}.json"),
      addPath: join(process.cwd(), "src/locales", "{{lng}}/{{ns}}.missing.json"),
    },
  });

  client.logger.info(`Loaded locales successfully. (default ${chalk.cyan(i18next.language)})`);
}

module.exports = { loadLocales };
