const { connect } = require("mongoose");
const colors = require("colors");
const { t } = require("i18next");

/**
 * A function to connect to mongobd throuigh mongoose
 * @type {import("./helpers.d.ts").ConnectDB}
 */
async function connectdb(client) {
  try {
    await connect(client.config.mongo_uri);
    client.logger.info(
      __filename,
      t("default:database.connected", { db: colors.magenta("mongodb") }),
    );
  } catch (error) {
    throw error;
  }
}

module.exports = { connectdb };
