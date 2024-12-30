const fs = require("fs");
const path = require("path");
const i18next = require("i18next");
const resources = require("@src/locales/index.js");

/**
 * A function to get default locale for global use
 * @type {import("./helpers.d.ts").GetDefaultLocale}
 */
function getDefaultLocale(client) {
  let { default_locale } = client.config;
  if (typeof default_locale !== "string") {
    default_locale = "en-US";
    return default_locale;
  }

  const localeFolders = fs.readdirSync(path.join(process.cwd(), "src", "locales"));
  if (!Array.isArray(localeFolders)) {
    throw new Error(
      "Couldn't load locales. Please make sure locale files exist within src folder.",
    );
  }

  if (default_locale.length <= 0 || !localeFolders.includes(default_locale)) {
    default_locale = "en-US";
  }

  return default_locale;
}

/**
 * A function to load locales
 * @type {import("./helpers.d.ts").LoadLocales}
 */
function loadLocales(client) {
  i18next.init({
    fallbackLng: getDefaultLocale(client),
    defaultNS: "",
    interpolation: {
      escapeValue: false,
    },
    resources,
  });
}

module.exports = { loadLocales, getDefaultLocale };
