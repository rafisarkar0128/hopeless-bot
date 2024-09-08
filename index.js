const { startBot } = require("./src/bot.js");

startBot().catch((error) => {
  throw error;
});
