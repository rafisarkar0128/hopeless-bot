require("dotenv").config();

const { REST } = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const rest = new REST().setToken(process.env.DISCORD_CLIENT_TOKEN);

async function fetchAndSaveEmojis() {
  const app = await rest.get("/applications/@me");
  const data = await rest.get(`/applications/${app.id}/emojis`);

  if (!Array.isArray(data.items)) {
    return console.log(
      chalk.redBright(`Unable to fetch emojis from ${app.name}`)
    );
  }

  let emojis = new Object();
  for (let emoji of data.items) {
    const isAnimated = emoji.animated ? "a" : "";
    emojis[emoji.name] = `<${isAnimated}:${emoji.name}:${emoji.id}>`;
  }

  fs.writeFileSync(
    "./scripts/emojis.json",
    JSON.stringify(emojis),
    console.error
  );

  const slash = process.platform === "win32" ? "\\" : "/";

  console.log(
    `Successfully fetched and saved emojis in ` +
      chalk.yellowBright(`${process.cwd()}${slash}scripts${slash}emojis.json`)
  );

  return;
}

fetchAndSaveEmojis().catch(console.error);
