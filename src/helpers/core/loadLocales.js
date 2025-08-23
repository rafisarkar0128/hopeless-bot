const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");

/**
 * A function to load languages
 * @param {import("@src/lib").DiscordClient} client
 * @returns {Promise<void>}
 * @example
 * await client.helpers.loadLocales(client);
 */
async function loadLocales(client) {
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
    preload: readdirSync(join(process.cwd(), "src", "locales")).filter((file) => {
      const isDirectory = lstatSync(join(process.cwd(), "src", "locales", file)).isDirectory();
      const langFiles = readdirSync(join(process.cwd(), "src", "locales", file));
      if (isDirectory && langFiles.length > 0) return true;
    }),
    backend: {
      loadPath: join(process.cwd(), "src", "locales", "{{lng}}/{{ns}}.json"),
      addPath: join(process.cwd(), "src", "locales", "{{lng}}/{{ns}}.missing.json"),
    },
  });

  client.logger.info("Loaded locales successfully.");
}

module.exports = { loadLocales };
