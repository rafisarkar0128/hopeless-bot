const fs = require("fs");
const path = require("path");
const i18next = require("i18next");
const resources = require("@src/locales/index.js");

/**
 * A function to get default locale for global use
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @returns {string}
 */
function getDefaultLocale(client) {
  let { default_locale } = client.config;
  if (typeof default_locale !== "string") {
    throw new TypeError("Value of defaut_locale must a string");
  }

  const localeFolders = fs.readdirSync(path.join(__dirname, "..", "..", "locales"));
  if (!Array.isArray(localeFolders)) {
    throw new Error(
      "Couldn't load locales. Please make sure the path to locale files is valid",
    );
  }

  if (default_locale.length <= 0) default_locale = "en-US";
  if (!localeFolders.includes(default_locale)) default_locale = "en-US";

  return default_locale;
}

/**
 * A function to load locales
 * @param {import("@lib/DiscordBot.js").DiscordBot} client
 * @returns {void}
 */
async function loadLocales(client) {
  i18next.init({
    fallbackLng: getDefaultLocale(client),
    defaultNS: "",
    interpolation: {
      escapeValue: false,
    },
    resources,
  });
}

module.exports = { loadLocales };
